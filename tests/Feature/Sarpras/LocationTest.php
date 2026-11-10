<?php

use App\Models\Asset;
use App\Models\Location;
use App\Models\User;

test('guests are redirected to login when visiting locations', function () {
    $this->get(route('locations.index'))->assertRedirect(route('login'));
});

test('users without permission cannot view locations', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('locations.index'))->assertForbidden();
});

test('locations index can be rendered', function () {
    $user = sarprasUser(['location.view']);
    Location::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('locations.index'));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/locations/index')
        ->has('locations', 3)
    );
});

test('location can be created', function () {
    $user = sarprasUser(['location.create']);

    $this->actingAs($user)->post(route('locations.store'), [
        'name' => 'Gedung A Lt. 2 R. 201',
        'description' => 'Ruang dosen',
    ]);

    $this->assertDatabaseHas('locations', [
        'name' => 'Gedung A Lt. 2 R. 201',
        'is_active' => true,
    ]);
});

test('location name must be unique', function () {
    $user = sarprasUser(['location.create']);
    Location::factory()->create(['name' => 'Gedung A']);

    $this->actingAs($user)->post(route('locations.store'), [
        'name' => 'Gedung A',
    ])->assertSessionHasErrors('name');
});

test('location can be updated', function () {
    $user = sarprasUser(['location.edit']);
    $location = Location::factory()->create();

    $this->actingAs($user)->put(route('locations.update', $location), [
        'name' => 'Gedung B Lt. 1',
        'description' => null,
    ]);

    $this->assertDatabaseHas('locations', [
        'id' => $location->id,
        'name' => 'Gedung B Lt. 1',
    ]);
});

test('location in use is deactivated instead of deleted', function () {
    $user = sarprasUser(['location.delete']);
    $location = Location::factory()->create();
    Asset::factory()->create(['location_id' => $location->id]);

    $this->actingAs($user)->delete(route('locations.destroy', $location));

    $this->assertDatabaseHas('locations', [
        'id' => $location->id,
        'is_active' => false,
    ]);
});

test('unused location can be deleted', function () {
    $user = sarprasUser(['location.delete']);
    $location = Location::factory()->create();

    $this->actingAs($user)->delete(route('locations.destroy', $location));

    $this->assertDatabaseMissing('locations', ['id' => $location->id]);
});
