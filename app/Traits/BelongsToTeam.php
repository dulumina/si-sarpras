<?php

namespace App\Traits;

use App\Models\Team;
use App\Models\TeamScope;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToTeam
{
    /**
     * Override di model child untuk mendaftarkan scope key.
     * Contoh: return 'post';
     */
    public static function teamScopeKey(): ?string
    {
        return null;
    }

    public static function bootBelongsToTeam(): void
    {
        static::creating(function ($model) {
            if (auth()->hasUser()) {
                $model->team_id ??= auth()->user()->current_team_id;
            }
        });

        static::addGlobalScope('team', function ($builder) {
            $scopeKey = static::teamScopeKey();

            if ($scopeKey !== null && ! static::isScopeActiveForTeam($scopeKey)) {
                return;
            }

            if (auth()->hasUser() && $teamId = auth()->user()->current_team_id) {
                $builder->where('team_id', $teamId);
            }
        });
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function scopeAllTeams($query)
    {
        return $query->withoutGlobalScope('team');
    }

    protected static function isScopeActiveForTeam(string $scopeKey): bool
    {
        $teamId = auth()->user()?->current_team_id;

        if ($teamId === null) {
            return false;
        }

        $cache = once(fn () => TeamScope::where('team_id', $teamId)
            ->where('is_active', true)
            ->pluck('scope')
            ->flip()
            ->all()
        );

        return isset($cache[$scopeKey]);
    }
}
