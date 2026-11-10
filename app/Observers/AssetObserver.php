<?php

namespace App\Observers;

use App\Models\Asset;
use BackedEnum;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Auth;

class AssetObserver
{
    /**
     * Handle the Asset "created" event.
     */
    public function created(Asset $asset): void
    {
        $asset->histories()->create([
            'user_id' => Auth::id(),
            'action' => 'created',
            'changes' => [],
        ]);
    }

    /**
     * Handle the Asset "updated" event: record changed attributes.
     */
    public function updated(Asset $asset): void
    {
        $dirty = collect($asset->getDirty())->except(['updated_at', 'created_at', 'deleted_at']);

        if ($dirty->isEmpty()) {
            return;
        }

        $original = collect($asset->getOriginal())->only($dirty->keys());

        $changes = $dirty->map(fn ($new, $key) => [
            'old' => $this->normalize($original->get($key)),
            'new' => $this->normalize($new),
        ])->all();

        $asset->histories()->create([
            'user_id' => Auth::id(),
            'action' => 'updated',
            'changes' => $changes,
        ]);
    }

    /**
     * Handle the Asset "deleted" event (soft delete = archive).
     */
    public function deleted(Asset $asset): void
    {
        $asset->histories()->create([
            'user_id' => Auth::id(),
            'action' => 'archived',
            'changes' => [],
        ]);
    }

    /**
     * Make a value JSON-safe for the changes column.
     */
    private function normalize(mixed $value): mixed
    {
        if ($value instanceof BackedEnum) {
            return $value->value;
        }

        if ($value instanceof CarbonInterface) {
            return $value->format('Y-m-d H:i:s');
        }

        return $value;
    }
}
