<?php

use App\Models\ApprovalFlow;
use App\Models\User;
use Spatie\Permission\Models\Role;

test('guests are redirected to login when visiting approval flow', function () {
    $this->get(route('approval_flow.edit'))->assertRedirect(route('login'));
});

test('users without permission cannot edit approval flow', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('approval_flow.edit'))->assertForbidden();
});

test('approval flow edit page renders current steps', function () {
    $user = sarprasUser(['approval-flow.edit']);
    ApprovalFlow::create([
        'module' => 'loan',
        'name' => 'Alur Persetujuan Peminjaman',
        'steps' => [['role' => 'admin', 'title' => 'Verifikasi Admin Sarpras']],
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->get(route('approval_flow.edit'));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/approval-flow/edit')
        ->where('flow.name', 'Alur Persetujuan Peminjaman')
        ->has('flow.steps', 1)
        ->has('roles')
    );
});

test('approval flow edit page creates empty flow when missing', function () {
    $user = sarprasUser(['approval-flow.edit']);
    Role::firstOrCreate(['name' => 'admin']);

    $response = $this->actingAs($user)->get(route('approval_flow.edit'));

    $response->assertOk();
    expect(ApprovalFlow::where('module', 'loan')->exists())->toBeTrue();
});

test('approval flow can be updated', function () {
    $user = sarprasUser(['approval-flow.edit']);
    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'pimpinan']);

    $response = $this->actingAs($user)->put(route('approval_flow.update'), [
        'name' => 'Alur Persetujuan Peminjaman',
        'steps' => [
            ['role' => 'admin', 'title' => 'Verifikasi Admin Sarpras'],
            ['role' => 'pimpinan', 'title' => 'Persetujuan Pimpinan'],
        ],
    ]);

    $response->assertRedirect(route('approval_flow.edit'));
    $flow = ApprovalFlow::where('module', 'loan')->first();
    expect($flow->steps)->toHaveCount(2);
    expect($flow->steps[0]['role'])->toBe('admin');
});

test('approval flow rejects unknown roles', function () {
    $user = sarprasUser(['approval-flow.edit']);

    $response = $this->actingAs($user)->put(route('approval_flow.update'), [
        'name' => 'Alur',
        'steps' => [
            ['role' => 'tidak-ada', 'title' => 'Langkah'],
        ],
    ]);

    $response->assertSessionHasErrors('steps.0.role');
});

test('approval flow requires at least one step', function () {
    $user = sarprasUser(['approval-flow.edit']);

    $response = $this->actingAs($user)->put(route('approval_flow.update'), [
        'name' => 'Alur',
        'steps' => [],
    ]);

    $response->assertSessionHasErrors('steps');
});
