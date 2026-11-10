<?php

namespace Database\Factories;

use App\Enums\LoanStatus;
use App\Models\LoanRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoanRequest>
 */
class LoanRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'purpose' => fake()->sentence(),
            'borrowed_at' => now()->addDay(),
            'due_at' => now()->addDays(3),
            'status' => LoanStatus::Pending->value,
            'approval_steps' => [
                ['role' => 'admin', 'title' => 'Verifikasi Admin Sarpras'],
            ],
            'current_step' => 0,
        ];
    }
}
