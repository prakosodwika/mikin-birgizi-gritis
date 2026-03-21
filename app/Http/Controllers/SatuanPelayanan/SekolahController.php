<?php

namespace App\Http\Controllers\SatuanPelayanan;

use App\Http\Controllers\Controller;
use App\Services\SekolahService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SekolahController extends Controller
{
    public function __construct(
        protected SekolahService $service
    ) {}

    public function index(Request $request)
    {
        $user = Auth::user();
        $filters = $request->all();
        $filters['satuan_pelayanan_pemenuhan_gizi_id'] = $user->satuan_pelayanan_pemenuhan_gizi_id;

        return Inertia::render('SatuanPelayanan/Sekolah/Index', [
            'sekolahs' => $this->service->getAll($filters),
            'filters' => $request->only(['search', 'level']),
        ]);
    }

    public function show(int $id)
    {
        $user = Auth::user();
        $sekolah = $this->service->findById($id);

        if ($sekolah->satuan_pelayanan_pemenuhan_gizi_id !== $user->satuan_pelayanan_pemenuhan_gizi_id) {
            abort(403, 'Unauthorized access to school data.');
        }

        return Inertia::render('SatuanPelayanan/Sekolah/Show', [
            'sekolah' => $sekolah,
        ]);
    }
}
