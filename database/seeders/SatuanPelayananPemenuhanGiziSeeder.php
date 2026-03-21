<?php

namespace Database\Seeders;

use App\Models\SatuanPelayananPemenuhanGizi;
use Illuminate\Database\Seeder;

class SatuanPelayananPemenuhanGiziSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            [
                'name' => 'Satuan Pelayanan Jakarta Pusat 01',
                'address' => 'Jl. Merdeka No. 1, Gambir, Jakarta Pusat',
                'contact_number' => '021-1234567',
                'status' => 'active',
            ],
            [
                'name' => 'Satuan Pelayanan Bandung Barat 05',
                'address' => 'Jl. Raya Lembang No. 45, Bandung',
                'contact_number' => '022-7654321',
                'status' => 'active',
            ],
            [
                'name' => 'Satuan Pelayanan Surabaya Timur 03',
                'address' => 'Jl. Dharmahusada No. 10, Surabaya',
                'contact_number' => '031-9876543',
                'status' => 'active',
            ],
        ];

        foreach ($units as $unit) {
            SatuanPelayananPemenuhanGizi::create($unit);
        }
    }
}
