<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramGizi extends Model
{
    use HasFactory;

    protected $fillable = [
        'satuan_pelayanan_pemenuhan_gizi_id',
        'tanggal',
        'nama_program',
        'kelompok_usia',
        'catatan',
        'jumlah_porsi',
        'status_validasi',
        'kalori_total',
        'protein_total',
        'lemak_total',
        'karbohidrat_total',
        'harga_per_porsi',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah_porsi' => 'integer',
        'kalori_total' => 'decimal:2',
        'protein_total' => 'decimal:2',
        'lemak_total' => 'decimal:2',
        'karbohidrat_total' => 'decimal:2',
        'harga_per_porsi' => 'decimal:2',
    ];

    public function bahans(): HasMany
    {
        return $this->hasMany(ProgramGiziBahan::class);
    }

    public function satuanPelayanan(): BelongsTo
    {
        return $this->belongsTo(SatuanPelayananPemenuhanGizi::class, 'satuan_pelayanan_pemenuhan_gizi_id');
    }

    public function isValid(): bool
    {
        return $this->status_validasi === 'valid';
    }

    public function isInvalid(): bool
    {
        return $this->status_validasi === 'invalid';
    }
}
