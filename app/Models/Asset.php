<?php

namespace App\Models;

use App\Enums\AssetCondition;
use App\Enums\AssetStatus;
use App\Observers\AssetObserver;
use Database\Factories\AssetFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'inventory_code',
    'name',
    'category_id',
    'location_id',
    'brand',
    'model',
    'serial_number',
    'acquisition_year',
    'acquisition_date',
    'acquisition_cost',
    'condition',
    'status',
    'notes',
])]
#[ObservedBy(AssetObserver::class)]
class Asset extends Model
{
    /** @use HasFactory<AssetFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the category of the asset.
     *
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the location of the asset.
     *
     * @return BelongsTo<Location, $this>
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get the images of the asset.
     *
     * @return HasMany<AssetImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(AssetImage::class);
    }

    /**
     * Get the change history of the asset.
     *
     * @return HasMany<AssetHistory, $this>
     */
    public function histories(): HasMany
    {
        return $this->hasMany(AssetHistory::class)->latest('id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'condition' => AssetCondition::class,
            'status' => AssetStatus::class,
            'acquisition_year' => 'integer',
            'acquisition_date' => 'date',
            'acquisition_cost' => 'decimal:2',
        ];
    }
}
