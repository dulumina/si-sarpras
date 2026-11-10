<?php

namespace App\Http\Controllers\Sarpras;

use App\Http\Controllers\Controller;
use App\Models\ApprovalFlow;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class ApprovalFlowController extends Controller
{
    /**
     * Show the editable loan approval flow.
     */
    public function edit(): Response
    {
        $flow = ApprovalFlow::firstOrCreate(
            ['module' => 'loan'],
            [
                'name' => 'Alur Persetujuan Peminjaman',
                'steps' => [],
                'is_active' => true,
            ],
        );

        return Inertia::render('sarpras/approval-flow/edit', [
            'flow' => [
                'name' => $flow->name,
                'steps' => $flow->steps,
            ],
            'roles' => Role::orderBy('name')->pluck('name'),
        ]);
    }

    /**
     * Update the loan approval flow.
     */
    public function update(Request $request): RedirectResponse
    {
        $roleNames = Role::pluck('name')->all();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'steps' => ['required', 'array', 'min:1'],
            'steps.*.role' => ['required', 'string', Rule::in($roleNames)],
            'steps.*.title' => ['required', 'string', 'max:100'],
        ]);

        $flow = ApprovalFlow::firstOrCreate(
            ['module' => 'loan'],
            [
                'name' => 'Alur Persetujuan Peminjaman',
                'steps' => [],
                'is_active' => true,
            ],
        );

        $flow->update([
            'name' => $validated['name'],
            'steps' => array_values($validated['steps']),
        ]);

        return redirect()->route('approval_flow.edit')->with('success', 'Alur persetujuan berhasil disimpan.');
    }
}
