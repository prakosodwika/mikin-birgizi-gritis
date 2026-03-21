<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramGiziBahan extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_gizi_id',
        'nama_bahan',
        'satuan',
        'jumlah',
        'kalori_per_100g',
        'protein_per_100g',
        'lemak_per_100g',
        'karbohidrat_per_100g',
        'harga_per_satuan',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
        'kalori_per_100g' => 'decimal:2',
        'protein_per_100g' => 'decimal:2',
        'lemak_per_100g' => 'decimal:2',
        'karbohidrat_per_100g' => 'decimal:2',
        'harga_per_satuan' => 'decimal:2',
    ];

    public function programGizi(): BelongsTo
    {
        return $this->belongsTo(ProgramGizi::class);
    }

    /**
     * Calculate the nutritional contribution of this ingredient to the recipe.
     * Returns values per-serving based on jumlah (total batch), divided by jumlah_porsi.
     */
    public function kaloriKontribusi(): float
    {
        return ($this->jumlah / 100) * $this->kalori_per_100g;
    }

    public function proteinKontribusi(): float
    {
        return ($this->jumlah / 100) * $this->protein_per_100g;
    }

    public function lemakKontribusi(): float
    {
        return ($this->jumlah / 100) * $this->lemak_per_100g;
    }

    public function karbohidratKontribusi(): float
    {
        return ($this->jumlah / 100) * $this->karbohidrat_per_100g;
    }

    public function totalHarga(): float
    {
        return $this->jumlah * $this->harga_per_satuan;
    }
}
