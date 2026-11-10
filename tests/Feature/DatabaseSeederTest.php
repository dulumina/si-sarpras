<?php

use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use App\Models\Room;
use App\Models\User;

test('database seeder populates master data and role users idempotently', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DatabaseSeeder::class);

    expect(Category::count())->toBe(3)
        ->and(Location::count())->toBe(4)
        ->and(Room::count())->toBe(4)
        ->and(Asset::count())->toBe(12);

    foreach (['admin', 'pimpinan', 'pegawai'] as $role) {
        $user = User::where('email', "{$role}@localhost")->firstOrFail();

        expect($user->hasRole($role))->toBeTrue();
    }

    expect(Asset::where('inventory_code', 'INV-00001')->firstOrFail()->category->name)->toBe('Elektronik');
});
