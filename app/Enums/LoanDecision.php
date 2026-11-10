<?php

namespace App\Enums;

enum LoanDecision: string
{
    case Approved = 'approved';
    case Rejected = 'rejected';

    /**
     * Human-readable label in Indonesian.
     */
    public function label(): string
    {
        return match ($this) {
            self::Approved => 'Disetujui',
            self::Rejected => 'Ditolak',
        };
    }
}
