<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    /**
     * Show the dashboard with stats scoped to the user's access.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->can('admin.access');

        return Inertia::render('dashboard', [
            'globalStats' => $isAdmin ? [
                'users' => User::count(),
                'roles' => Role::count(),
                'permissions' => Permission::count(),
                'teams' => Team::count(),
            ] : null,
            'personal' => [
                'teams' => $user->teams()->count(),
                'roles' => $user->getRoleNames(),
                'unreadNotifications' => $user->unreadNotifications()->count(),
                'memberSince' => $user->created_at->toISOString(),
            ],
            'recentUsers' => $isAdmin
                ? User::with('roles')->latest()->take(5)->get()->map(fn (User $recent) => [
                    'id' => $recent->id,
                    'name' => $recent->name,
                    'email' => $recent->email,
                    'roles' => $recent->getRoleNames(),
                    'created_at' => $recent->created_at->toISOString(),
                ])
                : [],
        ]);
    }
}
