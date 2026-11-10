<?php

namespace App\Models;

use App\Enums\LoanDecision;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['loan_request_id', 'step_index', 'user_id', 'decision', 'note'])]
class LoanApproval extends Model
{
    protected function casts(): array
    {
        return [
            'step_index' => 'integer',
            'decision' => LoanDecision::class,
        ];
    }

    /**
     * The loan request this decision belongs to.
     */
    public function loanRequest(): BelongsTo
    {
        return $this->belongsTo(LoanRequest::class);
    }

    /**
     * Approver who made the decision.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
