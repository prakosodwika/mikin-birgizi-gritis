<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSekolahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['string', 'max:255'],
            'address' => ['string', 'max:255'],
            'level' => ['in:PAUD,SD,SMP,SMA,SMK'],
            'total_students' => ['integer', 'min:0'],
            'kecamatan_id' => ['exists:kecamatans,id'],
            'satuan_pelayanan_pemenuhan_gizi_id' => ['nullable', 'exists:satuan_pelayanan_pemenuhan_gizis,id'],
        ];
    }
}
