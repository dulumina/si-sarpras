<?php

use App\Enums\AssetCondition;
use App\Enums\AssetStatus;
use App\Enums\LoanStatus;
use App\Models\ApprovalFlow;
use App\Models\Asset;
use App\Models\LoanRequest;
use App\Models\Room;
use App\Models\User;

function loanFlow(array $steps): ApprovalFlow
{
    return ApprovalFlow::updateOrCreate(
        ['module' => 'loan'],
        ['name' => 'Alur Persetujuan Peminjaman', 'steps' => $steps, 'is_active' => true],
    );
}

test('guests are redirected to login when visiting loans', function () {
    $this->get(route('loans.index'))->assertRedirect(route('login'));
});

test('users without permission cannot view loans', function () {
    $this->actingAs(User::factory()->create());

    $this->get(route('loans.index'))->assertForbidden();
});

test('non-approvers only see their own loan requests', function () {
    $owner = sarprasUser(['loan.view', 'loan.create']);
    LoanRequest::factory()->create(['user_id' => User::factory()->create()->id]);
    LoanRequest::factory()->create(['user_id' => $owner->id]);

    $response = $this->actingAs($owner)->get(route('loans.index'));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/loans/index')
        ->has('loans', 1)
    );
});

test('loan can be submitted with multiple assets and rooms', function () {
    $user = sarprasUser(['loan.create']);
    loanFlow([['role' => 'admin', 'title' => 'Verifikasi Admin']]);
    $assets = Asset::factory()->count(2)->create();
    $room = Room::factory()->create();

    $response = $this->actingAs($user)->post(route('loans.store'), [
        'purpose' => 'Rapat koordinasi',
        'borrowed_at' => '2026-12-01 08:00',
        'due_at' => '2026-12-03 08:00',
        'asset_ids' => $assets->pluck('id')->all(),
        'room_ids' => [$room->id],
    ]);

    $loan = LoanRequest::where('purpose', 'Rapat koordinasi')->first();

    $response->assertRedirect(route('loans.show', $loan));
    expect($loan->status)->toBe(LoanStatus::Pending);
    expect($loan->items()->count())->toBe(3);
    expect($loan->approval_steps)->toBe([['role' => 'admin', 'title' => 'Verifikasi Admin']]);
});

test('loan submission requires at least one item', function () {
    $user = sarprasUser(['loan.create']);
    loanFlow([['role' => 'admin', 'title' => 'Verifikasi Admin']]);

    $response = $this->actingAs($user)->post(route('loans.store'), [
        'purpose' => 'Rapat',
        'borrowed_at' => '2026-12-01 08:00',
        'due_at' => '2026-12-03 08:00',
        'asset_ids' => [],
        'room_ids' => [],
    ]);

    $response->assertSessionHasErrors('asset_ids');
    expect(LoanRequest::count())->toBe(0);
});

test('loan submission rejects unavailable assets', function () {
    $user = sarprasUser(['loan.create']);
    loanFlow([['role' => 'admin', 'title' => 'Verifikasi Admin']]);
    $asset = Asset::factory()->create(['status' => AssetStatus::Dipinjam]);

    $response = $this->actingAs($user)->post(route('loans.store'), [
        'purpose' => 'Rapat',
        'borrowed_at' => '2026-12-01 08:00',
        'due_at' => '2026-12-03 08:00',
        'asset_ids' => [$asset->id],
        'room_ids' => [],
    ]);

    $response->assertSessionHasErrors('asset_ids');
});

test('loan submission rejects overlapping schedule', function () {
    $user = sarprasUser(['loan.create']);
    loanFlow([['role' => 'admin', 'title' => 'Verifikasi Admin']]);
    $asset = Asset::factory()->create();
    $existing = LoanRequest::factory()->create([
        'borrowed_at' => '2026-12-01 08:00',
        'due_at' => '2026-12-03 08:00',
        'status' => LoanStatus::Active,
    ]);
    $existing->items()->create(['asset_id' => $asset->id]);

    $response = $this->actingAs($user)->post(route('loans.store'), [
        'purpose' => 'Rapat',
        'borrowed_at' => '2026-12-02 10:00',
        'due_at' => '2026-12-04 10:00',
        'asset_ids' => [$asset->id],
        'room_ids' => [],
    ]);

    $response->assertSessionHasErrors('asset_ids');
});

test('loan submission requires configured approval flow', function () {
    $user = sarprasUser(['loan.create']);
    ApprovalFlow::updateOrCreate(
        ['module' => 'loan'],
        ['name' => 'Alur', 'steps' => [], 'is_active' => true],
    );
    $asset = Asset::factory()->create();

    $response = $this->actingAs($user)->post(route('loans.store'), [
        'purpose' => 'Rapat',
        'borrowed_at' => '2026-12-01 08:00',
        'due_at' => '2026-12-03 08:00',
        'asset_ids' => [$asset->id],
        'room_ids' => [],
    ]);

    $response->assertSessionHasErrors('asset_ids');
});

test('loan advances through multi-step approval flow', function () {
    loanFlow([
        ['role' => 'admin', 'title' => 'Verifikasi Admin'],
        ['role' => 'pimpinan', 'title' => 'Persetujuan Pimpinan'],
    ]);
    $loan = LoanRequest::factory()->create([
        'approval_steps' => [
            ['role' => 'admin', 'title' => 'Verifikasi Admin'],
            ['role' => 'pimpinan', 'title' => 'Persetujuan Pimpinan'],
        ],
    ]);

    $this->actingAs(roleUser('admin', ['loan.approve']))
        ->post(route('loans.approve', $loan));

    expect($loan->fresh()->status)->toBe(LoanStatus::Pending);
    expect($loan->fresh()->current_step)->toBe(1);

    $this->actingAs(roleUser('pimpinan', ['loan.approve']))
        ->post(route('loans.approve', $loan), ['note' => 'Silakan']);

    $loan = $loan->fresh();
    expect($loan->status)->toBe(LoanStatus::Approved);
    expect($loan->approvals()->count())->toBe(2);
});

test('loan rejection stops the flow', function () {
    $steps = [['role' => 'admin', 'title' => 'Verifikasi Admin']];
    $loan = LoanRequest::factory()->create(['approval_steps' => $steps]);

    $this->actingAs(roleUser('admin', ['loan.approve']))
        ->post(route('loans.reject', $loan), ['note' => 'Tidak tersedia']);

    $loan = $loan->fresh();
    expect($loan->status)->toBe(LoanStatus::Rejected);
    expect($loan->approvals()->first()->note)->toBe('Tidak tersedia');
});

test('approval requires the role of the current step', function () {
    $steps = [['role' => 'admin', 'title' => 'Verifikasi Admin']];
    $loan = LoanRequest::factory()->create(['approval_steps' => $steps]);

    $this->actingAs(roleUser('pimpinan', ['loan.approve']))
        ->post(route('loans.approve', $loan))
        ->assertForbidden();
});

test('deciding an already processed loan is rejected', function () {
    $steps = [['role' => 'admin', 'title' => 'Verifikasi Admin']];
    $loan = LoanRequest::factory()->create([
        'approval_steps' => $steps,
        'status' => LoanStatus::Rejected,
    ]);

    $this->actingAs(roleUser('admin', ['loan.approve']))
        ->post(route('loans.approve', $loan))
        ->assertStatus(409);
});

test('handover marks assets as borrowed', function () {
    $loan = LoanRequest::factory()->create([
        'status' => LoanStatus::Approved,
        'approval_steps' => [['role' => 'admin', 'title' => 'Verifikasi Admin']],
    ]);
    $asset = Asset::factory()->create();
    $loan->items()->create(['asset_id' => $asset->id]);

    $this->actingAs(sarprasUser(['loan.approve']))
        ->post(route('loans.handover', $loan));

    expect($asset->fresh()->status)->toBe(AssetStatus::Dipinjam);
    expect($loan->fresh()->status)->toBe(LoanStatus::Active);
    expect($loan->fresh()->handed_at)->not->toBeNull();
});

test('return records condition and reactivates assets', function () {
    $loan = LoanRequest::factory()->create([
        'status' => LoanStatus::Active,
        'approval_steps' => [['role' => 'admin', 'title' => 'Verifikasi Admin']],
    ]);
    $asset = Asset::factory()->create(['status' => AssetStatus::Dipinjam]);
    $item = $loan->items()->create(['asset_id' => $asset->id]);

    $this->actingAs(sarprasUser(['loan.approve']))
        ->post(route('loans.return', $loan), ['conditions' => [$item->id => 'rusak']]);

    $loan = $loan->fresh();
    expect($loan->status)->toBe(LoanStatus::Returned);
    expect($loan->returned_at)->not->toBeNull();
    expect($item->fresh()->condition_in)->toBe(AssetCondition::Rusak);
    expect($asset->fresh()->status)->toBe(AssetStatus::Aktif);
    expect($asset->fresh()->condition)->toBe(AssetCondition::Rusak);
});

test('owner can cancel a pending loan', function () {
    $owner = sarprasUser(['loan.view']);
    $loan = LoanRequest::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($owner)
        ->post(route('loans.cancel', $loan))
        ->assertRedirect(route('loans.show', $loan));

    expect($loan->fresh()->status)->toBe(LoanStatus::Cancelled);
});

test('other users cannot cancel a pending loan', function () {
    $loan = LoanRequest::factory()->create();

    $this->actingAs(sarprasUser(['loan.view']))
        ->post(route('loans.cancel', $loan))
        ->assertForbidden();
});

test('loan show page renders steps and items', function () {
    $user = roleUser('admin', ['loan.view', 'loan.approve']);
    $steps = [['role' => 'admin', 'title' => 'Verifikasi Admin']];
    $loan = LoanRequest::factory()->create([
        'user_id' => $user->id,
        'approval_steps' => $steps,
    ]);
    $asset = Asset::factory()->create();
    $loan->items()->create(['asset_id' => $asset->id]);

    $response = $this->actingAs($user)->get(route('loans.show', $loan));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/loans/show')
        ->where('loan.id', $loan->id)
        ->has('items', 1)
        ->has('loan.steps', 1)
        ->where('loan.steps.0.state', 'current')
        ->where('can_approve', true)
    );
});

test('show page hides approve action from wrong role', function () {
    $steps = [['role' => 'pimpinan', 'title' => 'Persetujuan Pimpinan']];
    $loan = LoanRequest::factory()->create(['approval_steps' => $steps]);

    $response = $this->actingAs(sarprasUser(['loan.view', 'loan.approve']))
        ->get(route('loans.show', $loan));

    $response->assertOk()->assertInertia(
        fn ($assert) => $assert->where('can_approve', false),
    );
});

test('loan create page lists available assets and rooms', function () {
    $user = sarprasUser(['loan.create']);
    Asset::factory()->create();
    Asset::factory()->create(['status' => AssetStatus::Dipinjam]);
    Room::factory()->count(2)->create();

    $response = $this->actingAs($user)->get(route('loans.create'));

    $response->assertOk()->assertInertia(fn ($assert) => $assert
        ->component('sarpras/loans/create')
        ->has('assets', 1)
        ->has('rooms', 2)
    );
});
