<?php

namespace App\Http\Controllers\Sarpras;

use App\Enums\AssetCondition;
use App\Enums\AssetStatus;
use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    /**
     * Display a listing of the assets.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $perPage = (int) $request->get('perPage', 10);
        $categoryId = $request->get('category');
        $locationId = $request->get('location');
        $condition = $request->get('condition');
        $status = $request->get('status');

        $assets = Asset::with(['category:id,name', 'location:id,name'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('inventory_code', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('serial_number', 'like', "%{$search}%");
                });
            })
            ->when($categoryId, fn ($q) => $q->where('category_id', $categoryId))
            ->when($locationId, fn ($q) => $q->where('location_id', $locationId))
            ->when($condition, fn ($q) => $q->where('condition', $condition))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->through(fn ($asset) => [
                'id' => $asset->id,
                'inventory_code' => $asset->inventory_code,
                'name' => $asset->name,
                'category' => $asset->category?->name,
                'location' => $asset->location?->name,
                'brand' => $asset->brand,
                'condition' => $asset->condition->label(),
                'status' => $asset->status->label(),
                'acquisition_year' => $asset->acquisition_year,
            ]);

        return Inertia::render('sarpras/assets/index', [
            'assets' => $assets->items(),
            'total' => $assets->total(),
            'page' => $assets->currentPage(),
            'perPage' => $assets->perPage(),
            'search' => $search,
            'filters' => [
                'category' => $categoryId,
                'location' => $locationId,
                'condition' => $condition,
                'status' => $status,
            ],
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'locations' => Location::orderBy('name')->get(['id', 'name']),
            'conditions' => AssetCondition::options(),
            'statuses' => AssetStatus::options(),
        ]);
    }

    /**
     * Show the form for creating a new asset.
     */
    public function create(): Response
    {
        return Inertia::render('sarpras/assets/create', $this->formOptions());
    }

    /**
     * Store a newly created asset in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        Asset::create($validated);

        return redirect()->route('assets.index')->with('success', 'Aset berhasil dibuat.');
    }

    /**
     * Display the specified asset.
     */
    public function show(Asset $asset): Response
    {
        $asset->load(['category:id,name,description', 'location:id,name,description']);

        $categories = Category::pluck('name', 'id');
        $locations = Location::pluck('name', 'id');

        $histories = $asset->histories()
            ->with('user:id,name')
            ->get()
            ->map(fn ($history) => [
                'id' => $history->id,
                'action' => $history->action,
                'user' => $history->user?->name ?? 'Sistem',
                'changes' => $this->describeChanges($history->changes, $categories, $locations),
                'created_at' => $history->created_at->format('Y-m-d H:i:s'),
            ]);

        $images = $asset->images()->get()->map(fn ($image) => [
            'id' => $image->id,
            'url' => Storage::disk('public')->url($image->path),
        ]);

        return Inertia::render('sarpras/assets/show', [
            'asset' => [
                'id' => $asset->id,
                'inventory_code' => $asset->inventory_code,
                'name' => $asset->name,
                'category' => $asset->category?->name,
                'location' => $asset->location?->name,
                'brand' => $asset->brand,
                'model' => $asset->model,
                'serial_number' => $asset->serial_number,
                'acquisition_year' => $asset->acquisition_year,
                'acquisition_date' => $asset->acquisition_date?->format('Y-m-d'),
                'acquisition_cost' => $asset->acquisition_cost,
                'condition' => $asset->condition->label(),
                'status' => $asset->status->label(),
                'notes' => $asset->notes,
                'created_at' => $asset->created_at->format('Y-m-d H:i:s'),
            ],
            'images' => $images,
            'histories' => $histories,
        ]);
    }

    /**
     * Show the form for editing the specified asset.
     */
    public function edit(Asset $asset): Response
    {
        return Inertia::render('sarpras/assets/edit', [
            'asset' => [
                'id' => $asset->id,
                'inventory_code' => $asset->inventory_code,
                'name' => $asset->name,
                'category_id' => $asset->category_id,
                'location_id' => $asset->location_id,
                'brand' => $asset->brand,
                'model' => $asset->model,
                'serial_number' => $asset->serial_number,
                'acquisition_year' => $asset->acquisition_year,
                'acquisition_date' => $asset->acquisition_date?->format('Y-m-d'),
                'acquisition_cost' => $asset->acquisition_cost,
                'condition' => $asset->condition->value,
                'status' => $asset->status->value,
                'notes' => $asset->notes,
            ],
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update the specified asset in storage.
     */
    public function update(Request $request, Asset $asset): RedirectResponse
    {
        $validated = $request->validate($this->rules($asset));

        $asset->update($validated);

        return redirect()->route('assets.index')->with('success', 'Aset berhasil diperbarui.');
    }

    /**
     * Archive the asset (soft delete) so history stays traceable.
     */
    public function destroy(Asset $asset): RedirectResponse
    {
        $asset->delete();

        return redirect()->route('assets.index')->with('success', 'Aset berhasil diarsipkan.');
    }

    /**
     * Resolve a scanned inventory code to its asset detail page.
     */
    public function scan(string $code): RedirectResponse
    {
        $asset = Asset::where('inventory_code', $code)->first();

        if (! $asset) {
            Inertia::flash('toast', ['type' => 'error', 'message' => "Kode inventaris tidak dikenal: {$code}"]);

            return redirect()->route('assets.index');
        }

        return redirect()->route('assets.show', $asset);
    }

    /**
     * Upload a photo for the asset.
     */
    public function storeImage(Request $request, Asset $asset): RedirectResponse
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $path = $request->file('image')->store("assets/{$asset->id}", 'public');

        $asset->images()->create(['path' => $path]);

        return redirect()->route('assets.show', $asset)->with('success', 'Foto berhasil diunggah.');
    }

    /**
     * Delete a photo of the asset.
     */
    public function destroyImage(Asset $asset, int $imageId): RedirectResponse
    {
        $image = $asset->images()->whereKey($imageId)->firstOrFail();

        Storage::disk('public')->delete($image->path);
        $image->delete();

        return redirect()->route('assets.show', $asset)->with('success', 'Foto berhasil dihapus.');
    }

    /**
     * Validation rules for storing and updating an asset.
     *
     * @return array<string, mixed>
     */
    private function rules(?Asset $asset = null): array
    {
        $uniqueInventoryCode = $asset
            ? 'unique:assets,inventory_code,'.$asset->id
            : 'unique:assets,inventory_code';

        return [
            'inventory_code' => 'required|string|max:255|'.$uniqueInventoryCode,
            'name' => 'required|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'location_id' => 'nullable|integer|exists:locations,id',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'acquisition_year' => 'nullable|integer|min:1900|max:'.(int) now()->year + 1,
            'acquisition_date' => 'nullable|date',
            'acquisition_cost' => 'nullable|numeric|min:0',
            'condition' => ['required', Rule::enum(AssetCondition::class)],
            'status' => ['required', Rule::enum(AssetStatus::class)],
            'notes' => 'nullable|string|max:5000',
        ];
    }

    /**
     * Shared select options for the asset form pages.
     *
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'locations' => Location::orderBy('name')->get(['id', 'name']),
            'conditions' => AssetCondition::options(),
            'statuses' => AssetStatus::options(),
        ];
    }

    /**
     * Humanize a history changes payload into readable lines.
     *
     * @param  array<string, array{old: mixed, new: mixed}>  $changes
     * @param  Collection<int, string>  $categories
     * @param  Collection<int, string>  $locations
     * @return array<string, string>
     */
    private function describeChanges(array $changes, $categories, $locations): array
    {
        $labels = [
            'inventory_code' => 'Kode Inventaris',
            'name' => 'Nama',
            'category_id' => 'Kategori',
            'location_id' => 'Lokasi',
            'brand' => 'Merek',
            'model' => 'Model',
            'serial_number' => 'Nomor Seri',
            'acquisition_year' => 'Tahun Perolehan',
            'acquisition_date' => 'Tanggal Perolehan',
            'acquisition_cost' => 'Nilai Perolehan',
            'condition' => 'Kondisi',
            'status' => 'Status',
            'notes' => 'Catatan',
        ];

        $lines = [];

        foreach ($changes as $field => $change) {
            [$old, $new] = [$change['old'] ?? null, $change['new'] ?? null];

            if ($field === 'category_id') {
                $old = $categories[$old] ?? $old;
                $new = $categories[$new] ?? $new;
            } elseif ($field === 'location_id') {
                $old = $locations[$old] ?? $old;
                $new = $locations[$new] ?? $new;
            } elseif ($field === 'condition') {
                $old = AssetCondition::tryFrom((string) $old)?->label() ?? $old;
                $new = AssetCondition::tryFrom((string) $new)?->label() ?? $new;
            } elseif ($field === 'status') {
                $old = AssetStatus::tryFrom((string) $old)?->label() ?? $old;
                $new = AssetStatus::tryFrom((string) $new)?->label() ?? $new;
            }

            $lines[$field] = sprintf(
                '%s: %s → %s',
                $labels[$field] ?? $field,
                $old ?? '—',
                $new ?? '—',
            );
        }

        return $lines;
    }
}
