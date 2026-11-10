<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_scopes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('scope');
            $table->string('label');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['team_id', 'scope']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_scopes');
    }
};
