<?php

namespace App\Repositories;

use App\Models\ProgramGizi;
use App\Models\ProgramGiziBahan;
use App\Repositories\Interfaces\ProgramGiziRepositoryInterface;

class ProgramGiziRepository implements ProgramGiziRepositoryInterface
{
    public function getForSppg(int $sppgId, int $year, int $month)
    {
        return ProgramGizi::with('bahans')
            ->where('satuan_pelayanan_pemenuhan_gizi_id', $sppgId)
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->get();
    }

    public function findById(int $id)
    {
        return ProgramGizi::with('bahans')->findOrFail($id);
    }

    public function create(array $data): ProgramGizi
    {
        return ProgramGizi::create($data);
    }

    public function update(int $id, array $data): ProgramGizi
    {
        $program = ProgramGizi::findOrFail($id);
        $program->update($data);
        return $program->fresh();
    }

    public function delete(int $id): void
    {
        ProgramGizi::findOrFail($id)->delete();
    }

    public function syncBahans(int $programGiziId, array $bahans): void
    {
        ProgramGiziBahan::where('program_gizi_id', $programGiziId)->delete();

        foreach ($bahans as $bahan) {
            ProgramGiziBahan::create(array_merge($bahan, ['program_gizi_id' => $programGiziId]));
        }
    }
}
