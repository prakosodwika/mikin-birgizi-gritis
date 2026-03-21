<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StandarGiziSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $standards = [
            ['kelompok_usia' => 'PAUD', 'kalori' => 1000, 'protein' => 25, 'lemak' => 35, 'karbohidrat' => 150],
            ['kelompok_usia' => 'SD', 'kalori' => 1600, 'protein' => 45, 'lemak' => 55, 'karbohidrat' => 230],
            ['kelompok_usia' => 'SMP', 'kalori' => 2100, 'protein' => 65, 'lemak' => 70, 'karbohidrat' => 300],
            ['kelompok_usia' => 'SMA', 'kalori' => 2500, 'protein' => 75, 'lemak' => 80, 'karbohidrat' => 350],
            ['kelompok_usia' => 'Ibu Hamil', 'kalori' => 2500, 'protein' => 85, 'lemak' => 80, 'karbohidrat' => 360],
            ['kelompok_usia' => 'Ibu Menyusui', 'kalori' => 2600, 'protein' => 90, 'lemak' => 85, 'karbohidrat' => 370],
        ];

        foreach ($standards as $standard) {
            \App\Models\StandarGizi::create($standard);
        }
    }
}
