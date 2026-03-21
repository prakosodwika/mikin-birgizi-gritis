<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'role', 'satuan_pelayanan_pemenuhan_gizi_id', 'status', 'last_login_at'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the unit that the user belongs to.
     */
    public function satuanPelayananPemenuhanGizi(): BelongsTo
    {
        return $this->belongsTo(SatuanPelayananPemenuhanGizi::class);
    }

    public function isBadanGiziNasional(): bool
    {
        return $this->role === 'badan_gizi_nasional';
    }

    public function isOperatorSatuanPelayananPemenuhanGizi(): bool
    {
        return $this->role === 'operator_satuan_pelayanan_pemenuhan_gizi';
    }

    public function isAuditorIndependen(): bool
    {
        return $this->role === 'auditor_independen';
    }
}
