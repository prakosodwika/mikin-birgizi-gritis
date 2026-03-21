<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSatuanPelayananPemenuhanGiziRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            // Satuan Pelayanan Fields
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'provinsi_id' => ['nullable', 'exists:provinsis,id'],
            'kabupaten_id' => ['nullable', 'exists:kabupatens,id'],
            'kecamatan_id' => ['nullable', 'exists:kecamatans,id'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'status' => ['required', 'in:active,inactive'],

            // Admin User Fields (Auto-created)
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'admin_password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}
