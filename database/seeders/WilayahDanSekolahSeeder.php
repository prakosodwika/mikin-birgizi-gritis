<?php

namespace Database\Seeders;

use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use App\Models\Sekolah;
use App\Models\SatuanPelayananPemenuhanGizi;
use Illuminate\Database\Seeder;

class WilayahDanSekolahSeeder extends Seeder {
    public function run(): void {
        // 1. Data Wilayah
        $provinsi = Provinsi::create(['name' => 'Jawa Barat']);
        $kabupaten = Kabupaten::create(['provinsi_id' => $provinsi->id, 'name' => 'Bandung']);
        $kecamatan = Kecamatan::create(['kabupaten_id' => $kabupaten->id, 'name' => 'Lembang']);

        // 2. Satuan Pelayanan (Dummy)
        $satuanPelayanan = SatuanPelayananPemenuhanGizi::create([
            'name' => 'Satuan Pelayanan Lembang Utama',
            'address' => 'Jl. Raya Lembang No. 100',
            'contact_number' => '022-123456',
            'status' => 'active'
        ]);

        // 3. Data Sekolah terhubung ke Satuan Pelayanan
        $sekolahs = [
            ['name' => 'SD Negeri 01 Lembang', 'level' => 'SD', 'total_students' => 150],
            ['name' => 'SMP Negeri 01 Lembang', 'level' => 'SMP', 'total_students' => 300],
            ['name' => 'SMA Negeri 01 Lembang', 'level' => 'SMA', 'total_students' => 450],
            ['name' => 'SMK Negeri 01 Lembang', 'level' => 'SMK', 'total_students' => 500],
        ];

        foreach ($sekolahs as $data) {
            Sekolah::create([
                'name' => $data['name'],
                'address' => 'Alamat ' . $data['name'],
                'level' => $data['level'],
                'total_students' => $data['total_students'],
                'kecamatan_id' => $kecamatan->id,
                'satuan_pelayanan_pemenuhan_gizi_id' => $satuanPelayanan->id
            ]);
        }
    }
}
