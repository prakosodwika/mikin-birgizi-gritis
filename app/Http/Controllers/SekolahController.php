<?php

namespace App\Http\Controllers;

use App\Services\SekolahService;
use App\Services\KecamatanService;
use App\Services\SatuanPelayananPemenuhanGiziService;
use App\Http\Requests\StoreSekolahRequest;
use App\Http\Requests\UpdateSekolahRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SekolahController extends Controller
{
    public function __construct(
        protected SekolahService $service,
        protected KecamatanService $kecamatanService,
        protected SatuanPelayananPemenuhanGiziService $sppgService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('Sekolah/Index', [
            'sekolahs' => $this->service->paginate($request->all()),
            'kecamatans' => $this->kecamatanService->getAll(),
            'sppgs' => $this->sppgService->getAll(['per_page' => 100])['data'] ?? [],
            'filters' => $request->only(['search', 'level']),
        ]);
    }

    public function show(int $id)
    {
        return Inertia::render('Sekolah/Show', [
            'sekolah' => $this->service->findById($id),
        ]);
    }

    public function store(StoreSekolahRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->back()->with('success', 'Sekolah berhasil ditambahkan.');
    }

    public function update(UpdateSekolahRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());
        return redirect()->back()->with('success', 'Sekolah berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return redirect()->back()->with('success', 'Sekolah berhasil dihapus.');
    }
}
