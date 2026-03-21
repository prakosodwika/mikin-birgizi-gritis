<?php

namespace App\Services;

use App\Models\StandarGizi;
use App\Repositories\Interfaces\ProgramGiziRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ProgramGiziService
{
    public function __construct(
        protected ProgramGiziRepositoryInterface $repository
    ) {}

    public function getCalendarData(int $sppgId, int $year, int $month): array
    {
        $programs = $this->repository->getForSppg($sppgId, $year, $month);

        // Group by date string (Y-m-d) for easy frontend consumption
        return $programs->groupBy(fn($p) => $p->tanggal->format('Y-m-d'))->toArray();
    }

    public function findById(int $id)
    {
        return $this->repository->findById($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $bahans = $data['bahans'] ?? [];
            unset($data['bahans']);

            // Calculate totals from bahans
            $totals = $this->calculateTotals($bahans, $data['jumlah_porsi'] ?? 1);

            // Validate against BGN standard
            $statusValidasi = $this->validateAgainstStandard($data['kelompok_usia'], $totals);

            $program = $this->repository->create(array_merge($data, $totals, [
                'status_validasi' => $statusValidasi,
            ]));

            if (!empty($bahans)) {
                $this->repository->syncBahans($program->id, $bahans);
            }

            return $program->load('bahans');
        });
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $bahans = $data['bahans'] ?? [];
            unset($data['bahans']);

            // Recalculate totals
            $totals = $this->calculateTotals($bahans, $data['jumlah_porsi'] ?? 1);

            // Re-validate
            $statusValidasi = $this->validateAgainstStandard($data['kelompok_usia'], $totals);

            $program = $this->repository->update($id, array_merge($data, $totals, [
                'status_validasi' => $statusValidasi,
            ]));

            $this->repository->syncBahans($program->id, $bahans);

            return $program->load('bahans');
        });
    }

    public function delete(int $id): void
    {
        $this->repository->delete($id);
    }

    /**
     * Calculate total nutritional values and price per serving.
     * All nutritional values in ingredients are per 100g.
     * We calculate: (jumlah / 100) * nilai → total for batch, then ÷ jumlah_porsi
     */
    private function calculateTotals(array $bahans, int $jumlahPorsi): array
    {
        $kalori = 0;
        $protein = 0;
        $lemak = 0;
        $karbohidrat = 0;
        $totalHarga = 0;

        foreach ($bahans as $bahan) {
            $jumlah = (float) ($bahan['jumlah'] ?? 0);

            $kalori += ($jumlah / 100) * (float) ($bahan['kalori_per_100g'] ?? 0);
            $protein += ($jumlah / 100) * (float) ($bahan['protein_per_100g'] ?? 0);
            $lemak += ($jumlah / 100) * (float) ($bahan['lemak_per_100g'] ?? 0);
            $karbohidrat += ($jumlah / 100) * (float) ($bahan['karbohidrat_per_100g'] ?? 0);
            $totalHarga += $jumlah * (float) ($bahan['harga_per_satuan'] ?? 0);
        }

        $porsi = max($jumlahPorsi, 1);

        return [
            'kalori_total' => round($kalori / $porsi, 2),
            'protein_total' => round($protein / $porsi, 2),
            'lemak_total' => round($lemak / $porsi, 2),
            'karbohidrat_total' => round($karbohidrat / $porsi, 2),
            'harga_per_porsi' => round($totalHarga / $porsi, 2),
        ];
    }

    /**
     * Compare totals against BGN minimum standards.
     * Returns 'pending' if no standard found, 'valid' if all targets met, else 'invalid'.
     */
    private function validateAgainstStandard(string $kelompokUsia, array $totals): string
    {
        $standar = StandarGizi::where('kelompok_usia', $kelompokUsia)->first();

        if (!$standar) {
            return 'pending';
        }

        $meetsStandard =
            $totals['kalori_total'] >= $standar->kalori &&
            $totals['protein_total'] >= $standar->protein &&
            $totals['lemak_total'] >= $standar->lemak &&
            $totals['karbohidrat_total'] >= $standar->karbohidrat;

        return $meetsStandard ? 'valid' : 'invalid';
    }
}
