<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['module', 'name', 'steps', 'is_active'])]
class ApprovalFlow extends Model
{
    protected function casts(): array
    {
        return [
            'steps' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * The approval step at the given index, if any.
     *
     * @return array{role: string, title: string}|null
     */
    public function stepAt(int $index): ?array
    {
        return $this->steps[$index] ?? null;
    }
}
