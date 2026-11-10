<?php

namespace Database\Seeders;

use App\Models\ApprovalFlow;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'admin.access',
            'user.view', 'user.create', 'user.edit', 'user.delete',
            'role.view', 'role.create', 'role.edit', 'role.delete',
            'permission.view', 'permission.create', 'permission.edit', 'permission.delete',
            'permission.scan', 'permission.store-bulk',
            'category.view', 'category.create', 'category.edit', 'category.delete',
            'location.view', 'location.create', 'location.edit', 'location.delete',
            'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
            'room.view', 'room.create', 'room.edit', 'room.delete',
            'loan.view', 'loan.create', 'loan.approve',
            'approval-flow.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $role = Role::firstOrCreate(['name' => 'super-admin']);
        $role->givePermissionTo(Permission::all());

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'admin.access',
            'user.view', 'user.create', 'user.edit', 'user.delete',
            'category.view', 'category.create', 'category.edit', 'category.delete',
            'location.view', 'location.create', 'location.edit', 'location.delete',
            'asset.view', 'asset.create', 'asset.edit', 'asset.delete',
            'room.view', 'room.create', 'room.edit', 'room.delete',
            'loan.view', 'loan.create', 'loan.approve',
            'approval-flow.edit',
        ]);

        $approverRole = Role::firstOrCreate(['name' => 'pimpinan']);
        $approverRole->givePermissionTo([
            'category.view', 'location.view', 'asset.view', 'room.view',
            'loan.view', 'loan.approve',
        ]);

        $staffRole = Role::firstOrCreate(['name' => 'pegawai']);
        $staffRole->givePermissionTo([
            'category.view', 'location.view', 'asset.view', 'room.view',
            'loan.view', 'loan.create',
        ]);

        // Default multi-step approval flow for loan requests
        ApprovalFlow::firstOrCreate(
            ['module' => 'loan'],
            [
                'name' => 'Alur Persetujuan Peminjaman',
                'steps' => [
                    ['role' => 'admin', 'title' => 'Verifikasi Admin Sarpras'],
                    ['role' => 'pimpinan', 'title' => 'Persetujuan Pimpinan'],
                ],
                'is_active' => true,
            ],
        );

        // Assign super-admin to the admin user
        $user = User::where('email', 'superadmin@localhost')->first();
        if ($user) {
            $user->assignRole($role);
        }
    }
}
