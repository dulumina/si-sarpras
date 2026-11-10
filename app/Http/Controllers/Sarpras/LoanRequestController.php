<?php

namespace App\Http\Controllers\Sarpras;

use App\Enums\AssetCondition;
use App\Enums\AssetStatus;
use App\Enums\LoanDecision;
use App\Enums\LoanStatus;
use App\Http\Controllers\Controller;
use App\Models\ApprovalFlow;
use App\Models\Asset;
use App\Models\LoanApproval;
use App\Models\LoanRequest;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LoanRequestController extends Controller
{
    /**
     * Display a listing of loan requests.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $perPage = (int) $request->get('perPage', 10);
        $status = $request->get('status', '');

        $loans = LoanRequest::query()
            ->with('user:id,name')
            ->withCount('items')
            ->when($search, function ($query, $search) {
                $query->where('purpose', 'like', "%{$search}%");
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when(! $request->user()->can('loan.approve'), function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->through(fn (LoanRequest $loan) => [
                'id' => $loan->id,
                'borrower' => $loan->user->name,
                'purpose' => $loan->purpose,
                'item_count' => $loan->items_count,
                'borrowed_at' => $loan->borrowed_at->format('d/m/Y H:i'),
                'due_at' => $loan->due_at->format('d/m/Y H:i'),
                'status' => ['value' => $loan->status->value, 'label' => $loan->status->label()],
            ]);

        return Inertia::render('sarpras/loans/index', [
            'loans' => $loans->items(),
            'total' => $loans->total(),
            'page' => $loans->currentPage(),
            'perPage' => $loans->perPage(),
            'search' => $search,
            'status' => $status,
            'statuses' => LoanStatus::options(),
            'can_create' => $request->user()->can('loan.create'),
        ]);
    }

    /**
     * Show the form for creating a loan request.
     */
    public function create(): Response
    {
        return Inertia::render('sarpras/loans/create', [
            'assets' => Asset::query()
                ->where('status', AssetStatus::Aktif->value)
                ->orderBy('name')
                ->get(['id', 'inventory_code', 'name'])
                ->map(fn (Asset $asset) => [
                    'value' => $asset->id,
                    'label' => "{$asset->inventory_code} · {$asset->name}",
                ]),
            'rooms' => Room::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'capacity'])
                ->map(fn (Room $room) => [
                    'value' => $room->id,
                    'label' => $room->capacity
                        ? "{$room->name} ({$room->capacity} orang)"
                        : $room->name,
                ]),
        ]);
    }

    /**
     * Store a newly submitted loan request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'purpose' => ['required', 'string', 'max:1000'],
            'borrowed_at' => ['required', 'date'],
            'due_at' => ['required', 'date', 'after:borrowed_at'],
            'asset_ids' => ['nullable', 'array'],
            'asset_ids.*' => ['integer', 'exists:assets,id'],
            'room_ids' => ['nullable', 'array'],
            'room_ids.*' => ['integer', 'exists:rooms,id'],
        ]);

        $assetIds = $validated['asset_ids'] ?? [];
        $roomIds = $validated['room_ids'] ?? [];

        if (empty($assetIds) && empty($roomIds)) {
            return back()->withErrors(['asset_ids' => 'Pilih minimal satu aset atau ruangan.']);
        }

        $assets = Asset::query()->whereIn('id', $assetIds)->get();
        $rooms = Room::query()->whereIn('id', $roomIds)->get();

        if ($assets->count() !== count($assetIds) || $rooms->count() !== count($roomIds)) {
            return back()->withErrors(['asset_ids' => 'Ada aset atau ruangan yang tidak dikenal.']);
        }

        $unavailable = $assets->filter(
            fn (Asset $asset) => $asset->status !== AssetStatus::Aktif
        );

        if ($unavailable->isNotEmpty()) {
            return back()->withErrors([
                'asset_ids' => 'Aset berikut tidak tersedia: '.$unavailable->pluck('name')->implode(', '),
            ]);
        }

        $start = $validated['borrowed_at'];
        $end = $validated['due_at'];

        $busyAssets = $assets->filter(
            fn (Asset $asset) => LoanRequest::query()
                ->overlapping($start, $end)
                ->whereHas('items', fn ($query) => $query->where('asset_id', $asset->id))
                ->exists()
        );

        $busyRooms = $rooms->filter(
            fn (Room $room) => LoanRequest::query()
                ->overlapping($start, $end)
                ->whereHas('items', fn ($query) => $query->where('room_id', $room->id))
                ->exists()
        );

        if ($busyAssets->isNotEmpty() || $busyRooms->isNotEmpty()) {
            $names = $busyAssets->pluck('name')
                ->merge($busyRooms->pluck('name'))
                ->implode(', ');

            return back()->withErrors(['asset_ids' => "Jadwal bentrok dengan peminjaman lain: {$names}."]);
        }

        $steps = ApprovalFlow::query()
            ->where('module', 'loan')
            ->where('is_active', true)
            ->value('steps') ?? [];

        if (empty($steps)) {
            return back()->withErrors(['asset_ids' => 'Alur persetujuan peminjaman belum dikonfigurasi.']);
        }

        $loan = DB::transaction(function () use ($request, $validated, $assets, $rooms, $steps) {
            $loan = LoanRequest::create([
                'user_id' => $request->user()->id,
                'purpose' => $validated['purpose'],
                'borrowed_at' => $validated['borrowed_at'],
                'due_at' => $validated['due_at'],
                'status' => LoanStatus::Pending,
                'approval_steps' => $steps,
                'current_step' => 0,
            ]);

            foreach ($assets as $asset) {
                $loan->items()->create(['asset_id' => $asset->id]);
            }

            foreach ($rooms as $room) {
                $loan->items()->create(['room_id' => $room->id]);
            }

            return $loan;
        });

        return redirect()->route('loans.show', $loan)->with('success', 'Pengajuan peminjaman berhasil dikirim.');
    }

    /**
     * Display the specified loan request.
     */
    public function show(Request $request, LoanRequest $loanRequest): Response
    {
        $loanRequest->load(['user:id,name', 'items.asset', 'items.room', 'approvals.user:id,name']);

        $user = $request->user();

        $steps = collect($loanRequest->approval_steps)->map(function (array $step, int $index) use ($loanRequest) {
            $approval = $loanRequest->approvals->firstWhere('step_index', $index);

            return [
                'title' => $step['title'],
                'role' => $step['role'],
                'state' => $this->stepState($loanRequest, $index, $approval),
                'approval' => $approval ? [
                    'user' => $approval->user->name,
                    'decision' => $approval->decision->label(),
                    'note' => $approval->note,
                    'created_at' => $approval->created_at->format('d/m/Y H:i'),
                ] : null,
            ];
        });

        $canApprove = $loanRequest->status === LoanStatus::Pending
            && $user->can('loan.approve')
            && ($role = $loanRequest->currentStepRole()) !== null
            && ($user->hasRole($role) || $user->hasRole('super-admin'));

        return Inertia::render('sarpras/loans/show', [
            'loan' => [
                'id' => $loanRequest->id,
                'borrower' => $loanRequest->user->name,
                'purpose' => $loanRequest->purpose,
                'borrowed_at' => $loanRequest->borrowed_at->format('d/m/Y H:i'),
                'due_at' => $loanRequest->due_at->format('d/m/Y H:i'),
                'handed_at' => $loanRequest->handed_at?->format('d/m/Y H:i'),
                'returned_at' => $loanRequest->returned_at?->format('d/m/Y H:i'),
                'status' => ['value' => $loanRequest->status->value, 'label' => $loanRequest->status->label()],
                'steps' => $steps,
            ],
            'items' => $loanRequest->items->map(fn ($item) => [
                'id' => $item->id,
                'type' => $item->asset_id ? 'asset' : 'room',
                'label' => $item->asset
                    ? "{$item->asset->inventory_code} · {$item->asset->name}"
                    : $item->room->name,
                'condition_out' => $item->condition_out?->label(),
                'condition_in' => $item->condition_in?->label(),
            ]),
            'conditions' => AssetCondition::options(),
            'can_approve' => $canApprove,
            'can_handover' => $loanRequest->status === LoanStatus::Approved && $user->can('loan.approve'),
            'can_return' => $loanRequest->status === LoanStatus::Active && $user->can('loan.approve'),
            'can_cancel' => $loanRequest->status === LoanStatus::Pending
                && ($loanRequest->user_id === $user->id || $user->can('loan.approve')),
        ]);
    }

    /**
     * Approve the loan request at the current step.
     */
    public function approve(Request $request, LoanRequest $loanRequest): RedirectResponse
    {
        return $this->decide($request, $loanRequest, LoanDecision::Approved);
    }

    /**
     * Reject the loan request at the current step.
     */
    public function reject(Request $request, LoanRequest $loanRequest): RedirectResponse
    {
        return $this->decide($request, $loanRequest, LoanDecision::Rejected);
    }

    /**
     * Record the handover of approved items.
     */
    public function handover(Request $request, LoanRequest $loanRequest): RedirectResponse
    {
        abort_unless($loanRequest->status === LoanStatus::Approved, 409, 'Hanya pengajuan disetujui yang dapat diserahterimakan.');

        DB::transaction(function () use ($loanRequest) {
            $loanRequest->items->loadMissing('asset')->each(function ($item) {
                if ($item->asset) {
                    $item->asset->update(['status' => AssetStatus::Dipinjam]);
                }
            });

            $loanRequest->update([
                'status' => LoanStatus::Active,
                'handed_at' => now(),
            ]);
        });

        return redirect()->route('loans.show', $loanRequest)->with('success', 'Serah terima tercatat. Aset kini berstatus dipinjam.');
    }

    /**
     * Record the return of borrowed items.
     */
    public function returnLoan(Request $request, LoanRequest $loanRequest): RedirectResponse
    {
        abort_unless($loanRequest->status === LoanStatus::Active, 409, 'Hanya peminjaman aktif yang dapat dikembalikan.');

        $validated = $request->validate([
            'conditions' => ['nullable', 'array'],
            'conditions.*' => [Rule::enum(AssetCondition::class)],
        ]);

        DB::transaction(function () use ($loanRequest, $validated) {
            $loanRequest->items->loadMissing('asset')->each(function ($item) use ($validated) {
                $conditionIn = $validated['conditions'][$item->id] ?? null;

                $item->update(['condition_in' => $conditionIn]);

                if ($item->asset) {
                    $item->asset->update([
                        'status' => AssetStatus::Aktif,
                        'condition' => $conditionIn ?? $item->asset->condition,
                    ]);
                }
            });

            $loanRequest->update([
                'status' => LoanStatus::Returned,
                'returned_at' => now(),
            ]);
        });

        return redirect()->route('loans.show', $loanRequest)->with('success', 'Pengembalian tercatat.');
    }

    /**
     * Cancel a pending loan request.
     */
    public function cancel(Request $request, LoanRequest $loanRequest): RedirectResponse
    {
        abort_unless($loanRequest->status === LoanStatus::Pending, 409, 'Hanya pengajuan menunggu persetujuan yang dapat dibatalkan.');

        $user = $request->user();
        abort_unless($loanRequest->user_id === $user->id || $user->can('loan.approve'), 403);

        $loanRequest->update(['status' => LoanStatus::Cancelled]);

        return redirect()->route('loans.show', $loanRequest)->with('success', 'Pengajuan dibatalkan.');
    }

    /**
     * Record an approval decision and advance the flow.
     */
    private function decide(Request $request, LoanRequest $loanRequest, LoanDecision $decision): RedirectResponse
    {
        abort_unless($loanRequest->status === LoanStatus::Pending, 409, 'Pengajuan sudah diproses.');

        $validated = $request->validate([
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $role = $loanRequest->currentStepRole();
        $user = $request->user();

        abort_unless($role !== null && ($user->hasRole($role) || $user->hasRole('super-admin')), 403, 'Anda tidak berwenang pada langkah persetujuan ini.');

        DB::transaction(function () use ($loanRequest, $decision, $validated, $user) {
            $loanRequest->approvals()->create([
                'step_index' => $loanRequest->current_step,
                'user_id' => $user->id,
                'decision' => $decision,
                'note' => $validated['note'] ?? null,
            ]);

            if ($decision === LoanDecision::Approved) {
                $loanRequest->fill(['current_step' => $loanRequest->current_step + 1]);

                if (! $loanRequest->hasMoreSteps()) {
                    $loanRequest->status = LoanStatus::Approved;
                }

                $loanRequest->save();
            } else {
                $loanRequest->update(['status' => LoanStatus::Rejected]);
            }
        });

        $message = $decision === LoanDecision::Approved
            ? 'Persetujuan langkah ini tercatat.'
            : 'Pengajuan ditolak.';

        return redirect()->route('loans.show', $loanRequest)->with('success', $message);
    }

    /**
     * Derive the display state of an approval step.
     */
    private function stepState(LoanRequest $loan, int $index, ?LoanApproval $approval): string
    {
        if ($approval) {
            return $approval->decision->value;
        }

        if ($index < $loan->current_step) {
            return 'approved';
        }

        if ($index === $loan->current_step && $loan->status === LoanStatus::Pending) {
            return 'current';
        }

        return 'waiting';
    }
}
