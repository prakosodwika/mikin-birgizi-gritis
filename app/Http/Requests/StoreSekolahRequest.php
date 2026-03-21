<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSekolahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'level' => ['required', 'in:PAUD,SD,SMP,SMA,SMK'],
            'total_students' => ['required', 'integer', 'min:0'],
            'kecamatan_id' => ['required', 'exists:kecamatans,id'],
            'satuan_pelayanan_pemenuhan_gizi_id' => ['nullable', 'exists:satuan_pelayanan_pemenuhan_gizis,id'],
        ];
    }
}
