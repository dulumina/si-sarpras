<?php

use App\Enums\AssetCondition;
use App\Models\Asset;

test('creating an asset records a created history', function () {
    $asset = Asset::factory()->create();

    expect($asset->histories)->toHaveCount(1);
    expect($asset->histories->first()->action)->toBe('created');
});

test('updating an asset records field changes', function () {
    $asset = Asset::factory()->create();
    $oldName = $asset->name;

    $asset->condition = AssetCondition::Rusak;
    $asset->name = 'Proyektor Baru';
    $asset->save();

    $history = $asset->histories->first();

    expect($history->action)->toBe('updated');
    expect($history->changes)->toHaveKeys(['name', 'condition']);
    expect($history->changes['name'])->toEqual(['old' => $oldName, 'new' => 'Proyektor Baru']);
    expect($history->changes['condition'])->toEqual(['old' => 'baik', 'new' => 'rusak']);
});

test('archiving an asset records an archived history', function () {
    $asset = Asset::factory()->create();

    $asset->delete();

    expect($asset->histories->first()->action)->toBe('archived');
    expect($asset->fresh()->deleted_at)->not->toBeNull();
});

test('history records the acting user', function () {
    $user = sarprasUser(['asset.edit']);
    $this->actingAs($user);

    $asset = Asset::factory()->create();
    $asset->name = 'Nama Baru';
    $asset->save();

    expect($asset->histories->first()->user_id)->toBe($user->id);
});

test('history is exposed on the asset show page', function () {
    $user = sarprasUser(['asset.view', 'asset.edit']);
    $asset = Asset::factory()->create(['name' => 'Proyektor Lama']);

    $asset->name = 'Proyektor Baru';
    $asset->save();

    $this->actingAs($user)
        ->get(route('assets.show', $asset))
        ->assertOk()
        ->assertInertia(fn ($assert) => $assert
            ->component('sarpras/assets/show')
            ->where('histories.0.action', 'updated')
            ->where('histories.0.changes.name', 'Nama: Proyektor Lama → Proyektor Baru')
        );
});
