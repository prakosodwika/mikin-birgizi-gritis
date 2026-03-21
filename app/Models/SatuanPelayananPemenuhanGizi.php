<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'address', 'provinsi_id', 'kabupaten_id', 'kecamatan_id', 'contact_number', 'status', 'flagged_at', 'flag_note'])]
class SatuanPelayananPemenuhanGizi extends Model
{
    use HasFactory;

    /**
     * Get the users that belong to this unit.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
    
    public function provinsi(): BelongsTo
    {
        return $this->belongsTo(Provinsi::class);
    }
    
    public function kabupaten(): BelongsTo
    {
        return $this->belongsTo(Kabupaten::class);
    }
    
    public function kecamatan(): BelongsTo
    {
        return $this->belongsTo(Kecamatan::class);
    }
    
    public function isFlagged(): bool
    {
        return !is_null($this->flagged_at);
    }
}
