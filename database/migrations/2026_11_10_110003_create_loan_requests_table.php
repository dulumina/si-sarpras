<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loan_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('purpose');
            $table->dateTime('borrowed_at');
            $table->dateTime('due_at');
            $table->string('status')->default('pending')->index();
            // Snapshot of approval flow steps at submit time
            $table->json('approval_steps');
            $table->unsignedInteger('current_step')->default(0);
            $table->dateTime('handed_at')->nullable();
            $table->dateTime('returned_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_requests');
    }
};
