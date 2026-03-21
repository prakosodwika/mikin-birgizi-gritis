<?php

namespace App\Http\Controllers\SatuanPelayanan;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProgramGiziRequest;
use App\Http\Requests\UpdateProgramGiziRequest;
use App\Services\ProgramGiziService;
use App\Models\StandarGizi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgramGiziController extends Controller
{
    public function __construct(
        protected ProgramGiziService $service
    ) {}

    public function index(Request $request)
    {
        $sppgId = $request->user()->satuan_pelayanan_pemenuhan_gizi_id;
        $year = (int) $request->query('year', now()->year);
        $month = (int) $request->query('month', now()->month);

        $programs = $this->service->getCalendarData($sppgId, $year, $month);
        $standarGizi = StandarGizi::all(['kelompok_usia', 'kalori', 'protein', 'lemak', 'karbohidrat']);

        return Inertia::render('ProgramGizi/Index', [
            'programs' => $programs,
            'standar_gizi' => $standarGizi,
            'year' => $year,
            'month' => $month,
        ]);
    }

    public function create(Request $request)
    {
        $standarGizi = StandarGizi::all(['kelompok_usia', 'kalori', 'protein', 'lemak', 'karbohidrat']);
        $prefillDate = $request->query('tanggal', now()->toDateString());

        return Inertia::render('ProgramGizi/Create', [
            'standar_gizi' => $standarGizi,
            'prefill_date' => $prefillDate,
        ]);
    }

    public function store(StoreProgramGiziRequest $request)
    {
        $sppgId = $request->user()->satuan_pelayanan_pemenuhan_gizi_id;

        $this->service->create(array_merge($request->validated(), [
            'satuan_pelayanan_pemenuhan_gizi_id' => $sppgId,
        ]));

        return redirect()->route('pengelola.program-gizi.index')
            ->with('success', 'Program gizi berhasil dibuat.');
    }

    public function show(int $id)
    {
        $program = $this->service->findById($id);
        $standarGizi = StandarGizi::where('kelompok_usia', $program->kelompok_usia)->first();

        return Inertia::render('ProgramGizi/Show', [
            'program' => $program->load('bahans'),
            'standar_gizi' => $standarGizi,
        ]);
    }

    public function edit(int $id)
    {
        $program = $this->service->findById($id);
        $standarGizi = StandarGizi::all(['kelompok_usia', 'kalori', 'protein', 'lemak', 'karbohidrat']);

        return Inertia::render('ProgramGizi/Edit', [
            'program' => $program->load('bahans'),
            'standar_gizi' => $standarGizi,
        ]);
    }

    public function update(UpdateProgramGiziRequest $request, int $id)
    {
        $this->service->update($id, $request->validated());
        return redirect()->route('pengelola.program-gizi.show', $id)
            ->with('success', 'Program gizi berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return redirect()->route('pengelola.program-gizi.index')
            ->with('success', 'Program gizi berhasil dihapus.');
    }
}
