<?php

use App\Enums\UnitTypes;
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
        Schema::create('units', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')
                ->constrained('properties')
                ->cascadeOnDelete();

            $table->string('label', 30);
            $table->string('floor', 30)->nullable();

            $table->enum(
                'type',
                array_column(UnitTypes::cases(), 'value')
            )->default(UnitTypes::Commercial->value);

            $table->decimal('weight_coefficient', 5, 2)
                ->default(1);

            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
