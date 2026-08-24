<?php

use App\Enums\ObligationStatus;
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
        Schema::create('cycle_obligations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('annual_target_budget_id')
                ->constrained('annual_target_budgets')
                ->restrictOnDelete();

            $table->foreignId('ownership_id')
                ->constrained('unit_co_owners')
                ->restrictOnDelete();

            $table->decimal('share_amount', 12, 2);

            $table->decimal(
                'snapshot_contribution_weight',
                5,
                2
            );

            $table->decimal('base_monthly_rate', 12, 2);

            $table->smallInteger('payment_interval_months')
                ->default(1);

            $table->decimal('credit_balance', 12, 2)
                ->default(0);

            $table->enum(
                'status',
                array_column(ObligationStatus::cases(), 'value')
            )->default(ObligationStatus::Active->value);

            $table->date('departed_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cycle_obligations');
    }
};
