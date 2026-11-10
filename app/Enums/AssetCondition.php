<?php

namespace App\Enums;

enum AssetCondition: string
{
    case Baik = 'baik';
    case KurangBaik = 'kurang-baik';
    case Rusak = 'rusak';

    /**
     * Get the display label for the condition.
     */
    public function label(): string
    {
        return match ($this) {
            self::Baik => 'Baik',
            self::KurangBaik => 'Kurang Baik',
            self::Rusak => 'Rusak',
        };
    }

    /**
     * Get options for select inputs.
     *
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn (self $condition) => ['value' => $condition->value, 'label' => $condition->label()])
            ->values()
            ->toArray();
    }
}
