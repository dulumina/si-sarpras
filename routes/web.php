<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Sarpras\ApprovalFlowController;
use App\Http\Controllers\Sarpras\AssetController;
use App\Http\Controllers\Sarpras\CategoryController;
use App\Http\Controllers\Sarpras\LoanRequestController;
use App\Http\Controllers\Sarpras\LocationController;
use App\Http\Controllers\Sarpras\RoomController;
use App\Http\Controllers\Teams\TeamInvitationController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('readme', 'readme')->name('readme');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Notifications
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::post('notifications/{id}/mark-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // Sarpras: asset categories
    Route::controller(CategoryController::class)->group(function () {
        Route::get('categories', 'index')->name('categories.index')->middleware('can:category.view');
        Route::get('categories/create', 'create')->name('categories.create')->middleware('can:category.create');
        Route::post('categories', 'store')->name('categories.store')->middleware('can:category.create');
        Route::get('categories/{category}/edit', 'edit')->name('categories.edit')->middleware('can:category.edit');
        Route::put('categories/{category}', 'update')->name('categories.update')->middleware('can:category.edit');
        Route::delete('categories/{category}', 'destroy')->name('categories.destroy')->middleware('can:category.delete');
    });

    // Sarpras: asset locations
    Route::controller(LocationController::class)->group(function () {
        Route::get('locations', 'index')->name('locations.index')->middleware('can:location.view');
        Route::get('locations/create', 'create')->name('locations.create')->middleware('can:location.create');
        Route::post('locations', 'store')->name('locations.store')->middleware('can:location.create');
        Route::get('locations/{location}/edit', 'edit')->name('locations.edit')->middleware('can:location.edit');
        Route::put('locations/{location}', 'update')->name('locations.update')->middleware('can:location.edit');
        Route::delete('locations/{location}', 'destroy')->name('locations.destroy')->middleware('can:location.delete');
    });

    // Sarpras: assets
    Route::controller(AssetController::class)->group(function () {
        Route::get('assets', 'index')->name('assets.index')->middleware('can:asset.view');
        Route::get('assets/scan/{code}', 'scan')->name('assets.scan')->middleware('can:asset.view');
        Route::get('assets/create', 'create')->name('assets.create')->middleware('can:asset.create');
        Route::post('assets', 'store')->name('assets.store')->middleware('can:asset.create');
        Route::get('assets/{asset}', 'show')->name('assets.show')->middleware('can:asset.view');
        Route::get('assets/{asset}/edit', 'edit')->name('assets.edit')->middleware('can:asset.edit');
        Route::put('assets/{asset}', 'update')->name('assets.update')->middleware('can:asset.edit');
        Route::delete('assets/{asset}', 'destroy')->name('assets.destroy')->middleware('can:asset.delete');
        Route::post('assets/{asset}/images', 'storeImage')->name('assets.images.store')->middleware('can:asset.edit');
        Route::delete('assets/{asset}/images/{imageId}', 'destroyImage')->name('assets.images.destroy')->middleware('can:asset.edit');
    });

    // Sarpras: rooms
    Route::controller(RoomController::class)->group(function () {
        Route::get('rooms', 'index')->name('rooms.index')->middleware('can:room.view');
        Route::get('rooms/create', 'create')->name('rooms.create')->middleware('can:room.create');
        Route::post('rooms', 'store')->name('rooms.store')->middleware('can:room.create');
        Route::get('rooms/{room}/edit', 'edit')->name('rooms.edit')->middleware('can:room.edit');
        Route::put('rooms/{room}', 'update')->name('rooms.update')->middleware('can:room.edit');
        Route::delete('rooms/{room}', 'destroy')->name('rooms.destroy')->middleware('can:room.delete');
    });

    // Sarpras: loan requests
    Route::controller(LoanRequestController::class)->group(function () {
        Route::get('loans', 'index')->name('loans.index')->middleware('can:loan.view');
        Route::get('loans/create', 'create')->name('loans.create')->middleware('can:loan.create');
        Route::post('loans', 'store')->name('loans.store')->middleware('can:loan.create');
        Route::get('loans/{loanRequest}', 'show')->name('loans.show')->middleware('can:loan.view');
        Route::post('loans/{loanRequest}/approve', 'approve')->name('loans.approve')->middleware('can:loan.approve');
        Route::post('loans/{loanRequest}/reject', 'reject')->name('loans.reject')->middleware('can:loan.approve');
        Route::post('loans/{loanRequest}/handover', 'handover')->name('loans.handover')->middleware('can:loan.approve');
        Route::post('loans/{loanRequest}/return', 'returnLoan')->name('loans.return')->middleware('can:loan.approve');
        Route::post('loans/{loanRequest}/cancel', 'cancel')->name('loans.cancel');
    });

    // Sarpras: loan approval flow configuration
    Route::controller(ApprovalFlowController::class)->group(function () {
        Route::get('approval-flow', 'edit')->name('approval_flow.edit')->middleware('can:approval-flow.edit');
        Route::put('approval-flow', 'update')->name('approval_flow.update')->middleware('can:approval-flow.edit');
    });
});

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

Route::middleware(['auth', 'verified', 'role:super-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('roles', RoleController::class);
        Route::get('permissions/scan', [PermissionController::class, 'scan'])->name('permissions.scan');
        Route::post('permissions/bulk', [PermissionController::class, 'storeBulk'])->name('permissions.store-bulk');
        Route::resource('permissions', PermissionController::class);
    });

require __DIR__.'/settings.php';
