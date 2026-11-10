<?php

use App\Models\Asset;
use App\Models\Category;
use App\Models\User;

test('guests are redirected to login when visiting categories', function () {
    $this->get(route('categories.index'))->assertRedirect(route('login'));
});

test('users without permission cannot view categories', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('categories.index'))->assertForbidden();
});

test('categories index can be rendered', function () {
    $user = sarprasUser(['category.view']);
    Category::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('categories.index'));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/categories/index')
        ->has('categories', 3)
    );
});

test('category can be created', function () {
    $user = sarprasUser(['category.create']);

    $this->actingAs($user)->post(route('categories.store'), [
        'name' => 'Elektronik',
        'description' => 'Perangkat elektronik kantor',
    ]);

    $this->assertDatabaseHas('categories', [
        'name' => 'Elektronik',
        'is_active' => true,
    ]);
});

test('category name must be unique', function () {
    $user = sarprasUser(['category.create']);
    Category::factory()->create(['name' => 'Elektronik']);

    $this->actingAs($user)->post(route('categories.store'), [
        'name' => 'Elektronik',
    ])->assertSessionHasErrors('name');
});

test('category can be updated', function () {
    $user = sarprasUser(['category.edit']);
    $category = Category::factory()->create();

    $this->actingAs($user)->put(route('categories.update', $category), [
        'name' => 'Meubelair',
        'description' => 'Perabot kantor',
    ]);

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Meubelair',
    ]);
});

test('category in use is deactivated instead of deleted', function () {
    $user = sarprasUser(['category.delete']);
    $category = Category::factory()->create();
    Asset::factory()->create(['category_id' => $category->id]);

    $this->actingAs($user)->delete(route('categories.destroy', $category));

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'is_active' => false,
    ]);
});

test('unused category can be deleted', function () {
    $user = sarprasUser(['category.delete']);
    $category = Category::factory()->create();

    $this->actingAs($user)->delete(route('categories.destroy', $category));

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});

test('users without create permission cannot store categories', function () {
    $user = sarprasUser(['category.view']);

    $this->actingAs($user)->post(route('categories.store'), [
        'name' => 'Elektronik',
    ])->assertForbidden();

    $this->assertDatabaseMissing('categories', ['name' => 'Elektronik']);
});
