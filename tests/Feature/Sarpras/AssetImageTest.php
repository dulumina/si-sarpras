<?php

use App\Models\Asset;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('user with asset.edit permission can upload a photo', function () {
    Storage::fake('public');
    $user = sarprasUser(['asset.edit']);
    $asset = Asset::factory()->create();

    $file = UploadedFile::fake()->image('foto.jpg', 400, 300);

    $response = $this->actingAs($user)->post(
        route('assets.images.store', $asset),
        ['image' => $file],
    );

    $response->assertRedirect(route('assets.show', $asset));
    Storage::disk('public')->assertExists("assets/{$asset->id}/{$file->hashName()}");
    expect($asset->images()->count())->toBe(1);
});

test('upload rejects invalid files', function () {
    Storage::fake('public');
    $user = sarprasUser(['asset.edit']);
    $asset = Asset::factory()->create();

    $file = UploadedFile::fake()->create('dokumen.pdf', 100, 'application/pdf');

    $this->actingAs($user)
        ->post(route('assets.images.store', $asset), ['image' => $file])
        ->assertSessionHasErrors('image');

    expect($asset->images()->count())->toBe(0);
});

test('upload is forbidden without asset.edit permission', function () {
    Storage::fake('public');
    $user = sarprasUser(['asset.view']);
    $asset = Asset::factory()->create();

    $file = UploadedFile::fake()->image('foto.jpg', 100, 100);

    $this->actingAs($user)
        ->post(route('assets.images.store', $asset), ['image' => $file])
        ->assertForbidden();
});

test('user with asset.edit permission can delete a photo', function () {
    Storage::fake('public');
    $user = sarprasUser(['asset.edit']);
    $asset = Asset::factory()->create();

    $path = UploadedFile::fake()->image('lama.jpg', 100, 100)->store("assets/{$asset->id}", 'public');
    $image = $asset->images()->create(['path' => $path]);

    $response = $this->actingAs($user)->delete(
        route('assets.images.destroy', [$asset, $image]),
    );

    $response->assertRedirect(route('assets.show', $asset));
    Storage::disk('public')->assertMissing($path);
    $this->assertDatabaseMissing('asset_images', ['id' => $image->id]);
});

test('photo of another asset cannot be deleted through this asset', function () {
    Storage::fake('public');
    $user = sarprasUser(['asset.edit']);
    $assetA = Asset::factory()->create();
    $assetB = Asset::factory()->create();

    $path = UploadedFile::fake()->image('milik-b.jpg', 100, 100)->store("assets/{$assetB->id}", 'public');
    $imageB = $assetB->images()->create(['path' => $path]);

    $this->actingAs($user)
        ->delete(route('assets.images.destroy', [$assetA, $imageB]))
        ->assertNotFound();

    expect($assetB->images()->count())->toBe(1);
});
