<?php

namespace App\Http\Controllers;

use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use App\Http\Requests\StoreSatuanPelayananPemenuhanGiziRequest;
use App\Http\Requests\UpdateSatuanPelayananPemenuhanGiziRequest;
use App\Services\KabupatenService;
use App\Services\KecamatanService;
use App\Services\ProvinsiService;
use App\Services\SatuanPelayananPemenuhanGiziService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SatuanPelayananPemenuhanGiziController extends Controller
{
    public function __construct(
        protected SatuanPelayananPemenuhanGiziService $service,
        protected ProvinsiService $provinsiService,
        protected KabupatenService $kabupatenService,
        protected KecamatanService $kecamatanService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('SatuanPelayananPemenuhanGizi/Index', [
            'satuanPelayananPemenuhanGizis' => $this->service->getAll($request->all()),
            'provinsis' => $this->provinsiService->getAll(),
            'kabupatens' => $this->kabupatenService->getAll(),
            'kecamatans' => $this->kecamatanService->getAll(),
            'filters' => $request->only(['search', 'status', 'provinsi_id', 'kabupaten_id', 'is_flagged']),
        ]);
    }

    public function show(int $id)
    {
        $unit = $this->service->findById($id);
        $unit->load(['users', 'provinsi', 'kabupaten', 'kecamatan']);

        return Inertia::render('SatuanPelayananPemenuhanGizi/Show', [
            'satuan_pelayanan' => $unit,
        ]);
    }

    public function store(StoreSatuanPelayananPemenuhanGiziRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->back()->with('success', 'Satuan Pelayanan dan Akun Operator berhasil dibuat.');
    }

    public function update(UpdateSatuanPelayananPemenuhanGiziRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());
        return redirect()->back()->with('success', 'Satuan Pelayanan berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return redirect()->back()->with('success', 'Satuan Pelayanan berhasil dihapus.');
    }

    public function flag(Request $request, int $id)
    {
        $request->validate([
            'flag_note' => ['required', 'string', 'max:1000'],
        ]);

        $this->service->update($id, [
            'flagged_at' => now(),
            'flag_note' => $request->flag_note,
        ]);

        return redirect()->back()->with('success', 'Satuan Pelayanan berhasil ditandai (flagged).');
    }

    public function unflag(int $id)
    {
        $this->service->update($id, [
            'flagged_at' => null,
            'flag_note' => null,
        ]);

        return redirect()->back()->with('success', 'Tanda (flag) berhasil dihapus.');
    }
}
