<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSatuanPelayananPemenuhanGiziRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'provinsi_id' => ['nullable', 'exists:provinsis,id'],
            'kabupaten_id' => ['nullable', 'exists:kabupatens,id'],
            'kecamatan_id' => ['nullable', 'exists:kecamatans,id'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }
}
