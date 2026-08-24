<?php

use App\Enums\SyndicEvent;
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
        Schema::create('syndic_designations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')
                ->constrained('properties')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->string('event')->default('assigned');

            $table->enum(
                'status',
                array_column(SyndicEvent::cases(), 'value')
            )->default(SyndicEvent::Assigned->value);

            $table->foreignId('transferred_from_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestampTz('assigned_at')->useCurrent();
            $table->timestampTz('resigned_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('syndic_designations');
    }
};
