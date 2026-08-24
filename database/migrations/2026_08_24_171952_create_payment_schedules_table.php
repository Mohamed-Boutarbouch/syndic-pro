<?php

use App\Enums\ScheduleStatus;
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
        Schema::create('payment_schedules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cycle_obligation_id')
                ->constrained('cycle_obligations')
                ->restrictOnDelete();

            $table->smallInteger('installment_number');

            $table->date('due_date');

            $table->decimal('amount_due', 12, 2);

            $table->boolean('is_final_installment')
                ->default(false);

            $table->enum(
                'status',
                array_column(ScheduleStatus::cases(), 'value')
            )->default(ScheduleStatus::Pending->value);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_schedules');
    }
};
