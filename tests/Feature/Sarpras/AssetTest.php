<?php

use App\Enums\AssetCondition;
use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use App\Models\User;

test('guests are redirected to login when visiting assets', function () {
    $this->get(route('assets.index'))->assertRedirect(route('login'));
});

test('users without permission cannot view assets', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('assets.index'))->assertForbidden();
});

test('assets index can be rendered', function () {
    $user = sarprasUser(['asset.view']);
    Asset::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('assets.index'));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/assets/index')
        ->has('assets', 3)
    );
});

test('assets index can be filtered by status', function () {
    $user = sarprasUser(['asset.view']);
    Asset::factory()->count(2)->create();
    Asset::factory()->create(['condition' => AssetCondition::Rusak]);

    $response = $this->actingAs($user)->get(route('assets.index', ['condition' => 'rusak']));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/assets/index')
        ->has('assets', 1)
    );
});

test('assets index can be searched by inventory code', function () {
    $user = sarprasUser(['asset.view']);
    Asset::factory()->create(['inventory_code' => 'INV-99999']);
    Asset::factory()->count(2)->create();

    $response = $this->actingAs($user)->get(route('assets.index', ['search' => 'INV-99999']));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/assets/index')
        ->has('assets', 1)
    );
});

test('asset can be created with category and location', function () {
    $user = sarprasUser(['asset.create']);
    $category = Category::factory()->create();
    $location = Location::factory()->create();

    $this->actingAs($user)->post(route('assets.store'), [
        'inventory_code' => 'INV-00001',
        'name' => 'Proyektor Epson EB-X06',
        'category_id' => $category->id,
        'location_id' => $location->id,
        'brand' => 'Epson',
        'model' => 'EB-X06',
        'serial_number' => 'SN-ABC123',
        'acquisition_year' => 2024,
        'acquisition_date' => '2024-05-10',
        'acquisition_cost' => 5500000,
        'condition' => 'baik',
        'status' => 'aktif',
        'notes' => 'Aset pertama',
    ]);

    $this->assertDatabaseHas('assets', [
        'inventory_code' => 'INV-00001',
        'name' => 'Proyektor Epson EB-X06',
        'category_id' => $category->id,
        'location_id' => $location->id,
        'deleted_at' => null,
    ]);
});

test('inventory code must be unique', function () {
    $user = sarprasUser(['asset.create']);
    Asset::factory()->create(['inventory_code' => 'INV-00001']);

    $this->actingAs($user)->post(route('assets.store'), [
        'inventory_code' => 'INV-00001',
        'name' => 'Proyektor Lain',
        'condition' => 'baik',
        'status' => 'aktif',
    ])->assertSessionHasErrors('inventory_code');
});

test('asset condition must be a valid enum value', function () {
    $user = sarprasUser(['asset.create']);

    $this->actingAs($user)->post(route('assets.store'), [
        'inventory_code' => 'INV-00002',
        'name' => 'Proyektor Lain',
        'condition' => 'hengkeng',
        'status' => 'aktif',
    ])->assertSessionHasErrors('condition');
});

test('asset can be updated', function () {
    $user = sarprasUser(['asset.edit']);
    $asset = Asset::factory()->create(['name' => 'Nama Lama']);

    $this->actingAs($user)->put(route('assets.update', $asset), [
        'inventory_code' => $asset->inventory_code,
        'name' => 'Nama Baru',
        'condition' => 'kurang-baik',
        'status' => 'aktif',
    ]);

    $this->assertDatabaseHas('assets', [
        'id' => $asset->id,
        'name' => 'Nama Baru',
        'condition' => 'kurang-baik',
    ]);
});

test('asset detail can be rendered', function () {
    $user = sarprasUser(['asset.view']);
    $asset = Asset::factory()->create();

    $response = $this->actingAs($user)->get(route('assets.show', $asset));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/assets/show')
        ->where('asset.inventory_code', $asset->inventory_code)
    );
});

test('archiving an asset soft deletes it instead of removing it', function () {
    $user = sarprasUser(['asset.delete']);
    $asset = Asset::factory()->create();

    $this->actingAs($user)->delete(route('assets.destroy', $asset));

    $this->assertSoftDeleted($asset);
});

test('archived assets are hidden from the index', function () {
    $user = sarprasUser(['asset.view']);
    $asset = Asset::factory()->create();
    $asset->delete();

    $response = $this->actingAs($user)->get(route('assets.index'));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/assets/index')
        ->has('assets', 0)
    );
});
test('scanning a valid code redirects to the asset detail page', function () {
    $user = sarprasUser(['asset.view']);
    $asset = Asset::factory()->create();

    $this->actingAs($user)
        ->get(route('assets.scan', $asset->inventory_code))
        ->assertRedirect(route('assets.show', $asset));
});

test('scanning an unknown code redirects back with an error toast', function () {
    $user = sarprasUser(['asset.view']);

    $this->actingAs($user)
        ->get(route('assets.scan', 'INV-TIDAKADA'))
        ->assertRedirect(route('assets.index'));
});

test('guests cannot scan codes', function () {
    $this->get(route('assets.scan', 'INV-123'))->assertRedirect(route('login'));
});
