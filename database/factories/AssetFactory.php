<?php

namespace Database\Factories;

use App\Enums\AssetCondition;
use App\Enums\AssetStatus;
use App\Models\Asset;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Asset>
 */
class AssetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'inventory_code' => fake()->unique()->numerify('INV-#####'),
            'name' => fake()->words(2, true),
            'category_id' => null,
            'location_id' => null,
            'brand' => fake()->optional()->company(),
            'model' => fake()->optional()->bothify('Model-####'),
            'serial_number' => fake()->optional()->bothify('SN-?????-#####'),
            'acquisition_year' => fake()->optional()->numberBetween(2000, 2026),
            'acquisition_date' => fake()->optional()->date(),
            'acquisition_cost' => fake()->optional()->randomFloat(2, 100, 10000),
            'condition' => AssetCondition::Baik,
            'status' => AssetStatus::Aktif,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
