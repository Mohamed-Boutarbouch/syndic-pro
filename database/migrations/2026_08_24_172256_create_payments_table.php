<?php

use App\Enums\PaymentMethod;
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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cycle_obligation_id')
                ->constrained('cycle_obligations')
                ->restrictOnDelete();

            $table->foreignId('payment_schedule_id')
                ->nullable()
                ->constrained('payment_schedules')
                ->restrictOnDelete();

            $table->foreignId('paid_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('recorded_by_user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->decimal('amount', 12, 2);

            $table->dateTime('paid_at')->useCurrent();

            $table->enum(
                'method',
                array_column(PaymentMethod::cases(), 'value')
            )->default(PaymentMethod::Cash->value);

            $table->string('reference', 100)->nullable();
            $table->text('notes')->nullable();

            $table->timestampTz('voided_at')->nullable();

            $table->foreignId('voided_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('void_reason')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
