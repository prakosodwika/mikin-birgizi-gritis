<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKecamatanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kabupaten_id' => ['required', 'integer', 'exists:kabupatens,id'],
            'name' => ['required', 'string', 'max:255', 'unique:kecamatans,name,NULL,id,kabupaten_id,' . $this->input('kabupaten_id')],
        ];
    }
}
