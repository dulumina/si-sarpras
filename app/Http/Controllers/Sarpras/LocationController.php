<?php

namespace App\Http\Controllers\Sarpras;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    /**
     * Display a listing of the locations.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $perPage = (int) $request->get('perPage', 10);

        $locations = Location::withCount('assets')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate($perPage)
            ->through(fn ($location) => [
                'id' => $location->id,
                'name' => $location->name,
                'description' => $location->description,
                'is_active' => $location->is_active,
                'assets_count' => $location->assets_count,
                'created_at' => $location->created_at->format('Y-m-d H:i:s'),
            ]);

        return Inertia::render('sarpras/locations/index', [
            'locations' => $locations->items(),
            'total' => $locations->total(),
            'page' => $locations->currentPage(),
            'perPage' => $locations->perPage(),
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new location.
     */
    public function create(): Response
    {
        return Inertia::render('sarpras/locations/create');
    }

    /**
     * Store a newly created location in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:locations,name',
            'description' => 'nullable|string|max:1000',
        ]);

        Location::create($validated);

        return redirect()->route('locations.index')->with('success', 'Lokasi berhasil dibuat.');
    }

    /**
     * Show the form for editing the specified location.
     */
    public function edit(Location $location): Response
    {
        return Inertia::render('sarpras/locations/edit', [
            'location' => [
                'id' => $location->id,
                'name' => $location->name,
                'description' => $location->description,
            ],
        ]);
    }

    /**
     * Update the specified location in storage.
     */
    public function update(Request $request, Location $location): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:locations,name,'.$location->id,
            'description' => 'nullable|string|max:1000',
        ]);

        $location->update($validated);

        return redirect()->route('locations.index')->with('success', 'Lokasi berhasil diperbarui.');
    }

    /**
     * Delete the location, or deactivate it when still referenced by assets.
     */
    public function destroy(Location $location): RedirectResponse
    {
        if ($location->assets()->exists()) {
            $location->update(['is_active' => false]);

            return redirect()->route('locations.index')
                ->with('success', 'Lokasi masih dipakai aset, jadi dinonaktifkan alih-alih dihapus.');
        }

        $location->delete();

        return redirect()->route('locations.index')->with('success', 'Lokasi berhasil dihapus.');
    }
}
