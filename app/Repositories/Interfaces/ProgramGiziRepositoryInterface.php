<?php

namespace App\Repositories\Interfaces;

interface ProgramGiziRepositoryInterface
{
    public function getForSppg(int $sppgId, int $year, int $month);
    public function findById(int $id);
    public function create(array $data): \App\Models\ProgramGizi;
    public function update(int $id, array $data): \App\Models\ProgramGizi;
    public function delete(int $id): void;
    public function syncBahans(int $programGiziId, array $bahans): void;
}
