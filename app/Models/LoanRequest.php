<?php

namespace App\Models;

use App\Enums\LoanStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'purpose', 'borrowed_at', 'due_at', 'status', 'approval_steps', 'current_step', 'handed_at', 'returned_at'])]
class LoanRequest extends Model
{
    /** @use HasFactory<LoanRequestFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'borrowed_at' => 'datetime',
            'due_at' => 'datetime',
            'handed_at' => 'datetime',
            'returned_at' => 'datetime',
            'status' => LoanStatus::class,
            'approval_steps' => 'array',
            'current_step' => 'integer',
        ];
    }

    /**
     * Borrower who submitted the request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Assets and rooms included in the request.
     */
    public function items(): HasMany
    {
        return $this->hasMany(LoanItem::class);
    }

    /**
     * Decisions recorded per approval step.
     */
    public function approvals(): HasMany
    {
        return $this->hasMany(LoanApproval::class)->orderBy('step_index');
    }

    /**
     * Role that must act on the current approval step.
     */
    public function currentStepRole(): ?string
    {
        return $this->approval_steps[$this->current_step]['role'] ?? null;
    }

    /**
     * Whether more approval steps remain.
     */
    public function hasMoreSteps(): bool
    {
        return $this->current_step < count($this->approval_steps);
    }

    /**
     * Loans that occupy items during the given period.
     */
    public function scopeOverlapping(Builder $query, string $start, string $end): Builder
    {
        return $query
            ->whereIn('status', [LoanStatus::Approved, LoanStatus::Active])
            ->where('borrowed_at', '<', $end)
            ->where('due_at', '>', $start);
    }
}
