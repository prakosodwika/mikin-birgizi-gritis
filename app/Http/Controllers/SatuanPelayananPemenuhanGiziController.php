<?php

namespace App\Http\Controllers;

use App\Models\Provinsi;
use App\Models\Kabupaten;
use App\Models\Kecamatan;
use App\Http\Requests\StoreSatuanPelayananPemenuhanGiziRequest;
use App\Http\Requests\UpdateSatuanPelayananPemenuhanGiziRequest;
use App\Services\SatuanPelayananPemenuhanGiziService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SatuanPelayananPemenuhanGiziController extends Controller
{
    public function __construct(
        protected SatuanPelayananPemenuhanGiziService $service
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('SatuanPelayananPemenuhanGizi/Index', [
            'satuan_pelayanan_pemenuhan_gizis' => $this->service->getAll($request->all()),
            'provinsis' => Provinsi::all(),
            'kabupatens' => Kabupaten::all(), // Ideally filtered by selected provinsi on frontend
            'kecamatans' => Kecamatan::all(), // Ideally filtered by selected kabupaten on frontend
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
