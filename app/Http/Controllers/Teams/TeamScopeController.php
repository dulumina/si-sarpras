<?php

namespace App\Http\Controllers\Teams;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamScope;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamScopeController extends Controller
{
    /**
     * Get all registered scopes with their active status for the team.
     */
    public function index(Request $request, Team $team)
    {
        $registeredScopes = config('team-scopes.scopes', []);
        $teamScopes = $team->scopes()->get()->keyBy('scope');

        $scopes = collect($registeredScopes)->map(function ($config, $key) use ($teamScopes) {
            $teamScope = $teamScopes->get($key);

            return [
                'scope' => $key,
                'label' => $config['label'],
                'is_active' => $teamScope?->is_active ?? true,
            ];
        })->values();

        if ($request->wantsJson()) {
            return response()->json(['scopes' => $scopes]);
        }

        return Inertia::render('teams/edit', [
            'scopes' => $scopes,
        ]);
    }

    /**
     * Update scope active status for the team.
     */
    public function update(Request $request, Team $team): RedirectResponse
    {
        $request->validate([
            'scopes' => 'required|array',
            'scopes.*.scope' => 'required|string',
            'scopes.*.is_active' => 'required|boolean',
            'scopes.*.label' => 'sometimes|string',
        ]);

        foreach ($request->scopes as $scopeData) {
            TeamScope::updateOrCreate(
                [
                    'team_id' => $team->id,
                    'scope' => $scopeData['scope'],
                ],
                [
                    'label' => $scopeData['label'] ?? $scopeData['scope'],
                    'is_active' => $scopeData['is_active'],
                ]
            );
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Data scopes updated.'),
        ]);

        return to_route('teams.edit', ['team' => $team->slug]);
    }
}
