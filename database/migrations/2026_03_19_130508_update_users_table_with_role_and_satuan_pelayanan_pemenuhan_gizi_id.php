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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'badan_gizi_nasional',
                'operator_satuan_pelayanan_pemenuhan_gizi',
                'auditor_independen'
            ])->default('badan_gizi_nasional')->after('email');

            $table->foreignId('satuan_pelayanan_pemenuhan_gizi_id')
                ->nullable()
                ->after('role')
                ->constrained('satuan_pelayanan_pemenuhan_gizis')
                ->nullOnDelete();

            $table->enum('status', ['active', 'inactive'])->default('active')->after('satuan_pelayanan_pemenuhan_gizi_id');
            $table->timestamp('last_login_at')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['satuan_pelayanan_pemenuhan_gizi_id']);
            $table->dropColumn([
                'role',
                'satuan_pelayanan_pemenuhan_gizi_id',
                'status',
                'last_login_at'
            ]);
        });
    }
};
