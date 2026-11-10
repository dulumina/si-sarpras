<?php

namespace App\Enums;

enum AssetStatus: string
{
    case Aktif = 'aktif';
    case Dipinjam = 'dipinjam';
    case DalamPerbaikan = 'dalam-perbaikan';
    case Dihapus = 'dihapus';

    /**
     * Get the display label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Aktif => 'Aktif',
            self::Dipinjam => 'Dipinjam',
            self::DalamPerbaikan => 'Dalam Perbaikan',
            self::Dihapus => 'Dihapus',
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
            ->map(fn (self $status) => ['value' => $status->value, 'label' => $status->label()])
            ->values()
            ->toArray();
    }
}
