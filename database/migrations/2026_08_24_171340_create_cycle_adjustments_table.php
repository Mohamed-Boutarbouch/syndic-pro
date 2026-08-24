<?php

use App\Enums\AdjustmentType;
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
        Schema::create('cycle_adjustments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('annual_target_budget_id')
                ->constrained('annual_target_budgets')
                ->restrictOnDelete();

            $table->enum(
                'type',
                array_column(AdjustmentType::cases(), 'value')
            );

            $table->decimal('delta_amount', 12, 2);

            $table->text('reason');

            $table->foreignId('related_ownership_id')
                ->nullable()
                ->constrained('unit_ownerships')
                ->nullOnDelete();

            $table->foreignId('created_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cycle_adjustments');
    }
};
