<?php

namespace App\Models;

use App\Enums\AssetCondition;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['loan_request_id', 'asset_id', 'room_id', 'condition_out', 'condition_in'])]
class LoanItem extends Model
{
    protected function casts(): array
    {
        return [
            'condition_out' => AssetCondition::class,
            'condition_in' => AssetCondition::class,
        ];
    }

    /**
     * The loan request this item belongs to.
     */
    public function loanRequest(): BelongsTo
    {
        return $this->belongsTo(LoanRequest::class);
    }

    /**
     * Borrowed asset, when this item is an asset.
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    /**
     * Borrowed room, when this item is a room.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
