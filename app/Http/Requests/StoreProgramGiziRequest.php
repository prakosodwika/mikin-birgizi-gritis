<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgramGiziRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal' => ['required', 'date'],
            'nama_program' => ['required', 'string', 'max:255'],
            'kelompok_usia' => ['required', 'string', 'in:PAUD,SD,SMP,SMA,Ibu Hamil,Ibu Menyusui'],
            'catatan' => ['nullable', 'string'],
            'jumlah_porsi' => ['required', 'integer', 'min:1'],
            'bahans' => ['required', 'array', 'min:1'],
            'bahans.*.nama_bahan' => ['required', 'string', 'max:255'],
            'bahans.*.satuan' => ['required', 'string', 'max:50'],
            'bahans.*.jumlah' => ['required', 'numeric', 'min:0'],
            'bahans.*.kalori_per_100g' => ['required', 'numeric', 'min:0'],
            'bahans.*.protein_per_100g' => ['required', 'numeric', 'min:0'],
            'bahans.*.lemak_per_100g' => ['required', 'numeric', 'min:0'],
            'bahans.*.karbohidrat_per_100g' => ['required', 'numeric', 'min:0'],
            'bahans.*.harga_per_satuan' => ['required', 'numeric', 'min:0'],
        ];
    }
}
