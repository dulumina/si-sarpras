<?php

namespace App\Http\Controllers\Sarpras;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $perPage = (int) $request->get('perPage', 10);

        $rooms = Room::query()
            ->with('location:id,name')
            ->withCount('loanItems')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->through(fn (Room $room) => [
                'id' => $room->id,
                'name' => $room->name,
                'description' => $room->description,
                'capacity' => $room->capacity,
                'location' => $room->location?->name,
                'is_active' => $room->is_active,
                'loan_count' => $room->loan_items_count,
            ]);

        return Inertia::render('sarpras/rooms/index', [
            'rooms' => $rooms->items(),
            'total' => $rooms->total(),
            'page' => $rooms->currentPage(),
            'perPage' => $rooms->perPage(),
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new room.
     */
    public function create(): Response
    {
        return Inertia::render('sarpras/rooms/create', [
            'locations' => Location::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'capacity' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'location_id' => ['nullable', 'exists:locations,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        Room::create($validated);

        return redirect()->route('rooms.index')->with('success', 'Ruangan berhasil dibuat.');
    }

    /**
     * Show the form for editing the specified room.
     */
    public function edit(Room $room): Response
    {
        return Inertia::render('sarpras/rooms/edit', [
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
                'description' => $room->description,
                'capacity' => $room->capacity,
                'location_id' => $room->location_id,
                'is_active' => $room->is_active,
            ],
            'locations' => Location::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified room.
     */
    public function update(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'capacity' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'location_id' => ['nullable', 'exists:locations,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        $room->update($validated);

        return redirect()->route('rooms.index')->with('success', 'Ruangan berhasil diperbarui.');
    }

    /**
     * Deactivate a room that has loans, otherwise delete it.
     */
    public function destroy(Room $room): RedirectResponse
    {
        if ($room->loanItems()->exists()) {
            $room->update(['is_active' => false]);

            return redirect()->route('rooms.index')->with('success', 'Ruangan pernah dipinjam sehingga hanya dinonaktifkan.');
        }

        $room->delete();

        return redirect()->route('rooms.index')->with('success', 'Ruangan berhasil dihapus.');
    }
}
