<?php

use App\Models\LoanItem;
use App\Models\LoanRequest;
use App\Models\Room;
use App\Models\User;

test('guests are redirected to login when visiting rooms', function () {
    $this->get(route('rooms.index'))->assertRedirect(route('login'));
});

test('users without permission cannot view rooms', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('rooms.index'))->assertForbidden();
});

test('rooms index can be rendered', function () {
    $user = sarprasUser(['room.view']);
    Room::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('rooms.index'));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/rooms/index')
        ->has('rooms', 3)
    );
});

test('room can be created', function () {
    $user = sarprasUser(['room.create']);

    $response = $this->actingAs($user)->post(route('rooms.store'), [
        'name' => 'Aula Utama',
        'description' => 'Ruang serbaguna',
        'capacity' => 40,
        'location_id' => null,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('rooms.index'));
    expect(Room::where('name', 'Aula Utama')->exists())->toBeTrue();
});

test('room can be updated', function () {
    $user = sarprasUser(['room.edit']);
    $room = Room::factory()->create();

    $response = $this->actingAs($user)->put(route('rooms.update', $room), [
        'name' => 'Aula Baru',
        'description' => null,
        'capacity' => 50,
        'location_id' => null,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('rooms.index'));
    expect($room->fresh()->name)->toBe('Aula Baru');
});

test('room without loan history can be deleted', function () {
    $user = sarprasUser(['room.delete']);
    $room = Room::factory()->create();

    $this->actingAs($user)->delete(route('rooms.destroy', $room));

    $this->assertDatabaseMissing('rooms', ['id' => $room->id]);
});

test('room with loan history is deactivated instead of deleted', function () {
    $user = sarprasUser(['room.delete']);
    $room = Room::factory()->create();
    $loan = LoanRequest::factory()->create();
    LoanItem::create(['loan_request_id' => $loan->id, 'room_id' => $room->id]);

    $this->actingAs($user)->delete(route('rooms.destroy', $room));

    expect($room->fresh()->is_active)->toBeFalse();
    $this->assertDatabaseHas('rooms', ['id' => $room->id]);
});
