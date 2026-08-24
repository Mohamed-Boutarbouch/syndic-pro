<?php

use App\Enums\BillingFrequency;
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
        Schema::create('unit_co_owners', function (Blueprint $table) {
            $table->id();

            $table->foreignId('unit_id')
                ->constrained('units')
                ->cascadeOnDelete();

            $table->foreignId('co_owner_id')
                ->constrained('co_owners')
                ->cascadeOnDelete();

            $table->decimal('ownership_percentage', 5, 2)
                ->nullable();

            $table->enum(
                'billing_frequency',
                array_column(BillingFrequency::cases(), 'value')
            )->default(BillingFrequency::Monthly->value);

            $table->boolean('is_designated_syndic')
                ->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_co_owners');
    }
};
