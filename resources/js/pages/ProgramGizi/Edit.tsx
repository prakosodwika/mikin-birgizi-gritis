import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProgramGizi, StandarGizi } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
    show as programGiziShow,
    update as programGiziUpdate,
} from '@/routes/pengelola/program-gizi';

const KELOMPOK_USIA = ['PAUD', 'SD', 'SMP', 'SMA', 'Ibu Hamil', 'Ibu Menyusui'] as const;

type BahanForm = {
    nama_bahan: string;
    satuan: string;
    jumlah: number;
    kalori_per_100g: number;
    protein_per_100g: number;
    lemak_per_100g: number;
    karbohidrat_per_100g: number;
    harga_per_satuan: number;
};

interface Props {
    program: ProgramGizi;
    standar_gizi: StandarGizi[];
}

function ValidationBadge({ status }: { status: 'valid' | 'invalid' | 'pending' }) {
    if (status === 'valid') return <Badge className="bg-green-100 text-green-700 border-green-200 gap-1"><CheckCircle className="size-3" /> Lolos Standar BGN</Badge>;
    if (status === 'invalid') return <Badge className="bg-red-100 text-red-700 border-red-200 gap-1"><XCircle className="size-3" /> Belum Memenuhi Standar</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1"><Clock className="size-3" /> Standar Belum Tersedia</Badge>;
}

export default function ProgramGiziEdit({ program, standar_gizi }: Props) {
    const initBahans = (): BahanForm[] => (program.bahans || []).map(b => ({
        nama_bahan: b.nama_bahan, satuan: b.satuan, jumlah: Number(b.jumlah),
        kalori_per_100g: Number(b.kalori_per_100g), protein_per_100g: Number(b.protein_per_100g),
        lemak_per_100g: Number(b.lemak_per_100g), karbohidrat_per_100g: Number(b.karbohidrat_per_100g),
        harga_per_satuan: Number(b.harga_per_satuan),
    }));

    const [bahans, setBahans] = useState<BahanForm[]>(initBahans);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Program Gizi', href: '/pengelola/program-gizi' },
        { title: program.nama_program, href: programGiziShow(program.id).url },
        { title: 'Edit', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm<{
        tanggal: string;
        nama_program: string;
        kelompok_usia: string;
        catatan: string;
        jumlah_porsi: number;
        bahans: BahanForm[];
    }>({
        tanggal: program.tanggal,
        nama_program: program.nama_program,
        kelompok_usia: program.kelompok_usia,
        catatan: program.catatan || '',
        jumlah_porsi: program.jumlah_porsi,
        bahans: initBahans(),
    });

    const standarForSelected = standar_gizi.find(s => s.kelompok_usia === data.kelompok_usia);

    const liveTotals = useMemo(() => {
        const porsi = Math.max(data.jumlah_porsi || 1, 1);
        let kalori = 0, protein = 0, lemak = 0, karbohidrat = 0, harga = 0;
        for (const b of bahans) {
            kalori += (b.jumlah / 100) * b.kalori_per_100g;
            protein += (b.jumlah / 100) * b.protein_per_100g;
            lemak += (b.jumlah / 100) * b.lemak_per_100g;
            karbohidrat += (b.jumlah / 100) * b.karbohidrat_per_100g;
            harga += b.jumlah * b.harga_per_satuan;
        }
        return {
            kalori: +(kalori / porsi).toFixed(1),
            protein: +(protein / porsi).toFixed(1),
            lemak: +(lemak / porsi).toFixed(1),
            karbohidrat: +(karbohidrat / porsi).toFixed(1),
            harga: +(harga / porsi).toFixed(0),
        };
    }, [bahans, data.jumlah_porsi]);

    const validationStatus = useMemo((): 'valid' | 'invalid' | 'pending' => {
        if (!standarForSelected) return 'pending';
        return (
            liveTotals.kalori >= standarForSelected.kalori &&
            liveTotals.protein >= standarForSelected.protein &&
            liveTotals.lemak >= standarForSelected.lemak &&
            liveTotals.karbohidrat >= standarForSelected.karbohidrat
        ) ? 'valid' : 'invalid';
    }, [liveTotals, standarForSelected]);

    const updateBahan = (idx: number, field: keyof BahanForm, value: string | number) => {
        const updated = [...bahans];
        (updated[idx] as any)[field] = value;
        setBahans(updated);
        setData('bahans', updated);
    };

    const addBahan = () => {
        const updated = [...bahans, { nama_bahan: '', satuan: 'gram', jumlah: 0, kalori_per_100g: 0, protein_per_100g: 0, lemak_per_100g: 0, karbohidrat_per_100g: 0, harga_per_satuan: 0 }];
        setBahans(updated);
        setData('bahans', updated);
    };

    const removeBahan = (idx: number) => {
        const updated = bahans.filter((_, i) => i !== idx);
        setBahans(updated);
        setData('bahans', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(programGiziUpdate(program.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit — ${program.nama_program}`} />
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button type="button" variant="ghost" size="icon" onClick={() => router.visit(programGiziShow(program.id).url)}>
                                <ArrowLeft className="size-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-semibold">Edit Program Gizi</h1>
                                <p className="text-sm text-muted-foreground">Perubahan akan divalidasi ulang secara otomatis terhadap standar BGN.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ValidationBadge status={validationStatus} />
                            <Button type="button" variant="outline" onClick={() => router.visit(programGiziShow(program.id).url)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Left: Info + Ingredients */}
                        <div className="col-span-2 space-y-6">
                            <Card>
                                <CardHeader><CardTitle className="text-sm">Informasi Dasar</CardTitle></CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nama Program <span className="text-destructive">*</span></Label>
                                        <Input value={data.nama_program} onChange={e => setData('nama_program', e.target.value)} />
                                        {errors.nama_program && <p className="text-xs text-destructive">{errors.nama_program}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kelompok Usia <span className="text-destructive">*</span></Label>
                                        <Select value={data.kelompok_usia} onValueChange={v => setData('kelompok_usia', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>{KELOMPOK_USIA.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tanggal <span className="text-destructive">*</span></Label>
                                        <Input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Jumlah Porsi (batch) <span className="text-destructive">*</span></Label>
                                        <Input type="number" min={1} value={data.jumlah_porsi} onChange={e => setData('jumlah_porsi', parseInt(e.target.value))} />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Catatan (Opsional)</Label>
                                        <Textarea value={data.catatan} onChange={e => setData('catatan', e.target.value)} rows={2} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm">Komposisi Bahan</CardTitle>
                                        <Button type="button" size="sm" variant="outline" onClick={addBahan}>
                                            <Plus className="size-3 mr-1" /> Tambah Bahan
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama Bahan</TableHead>
                                                <TableHead className="w-24">Jumlah</TableHead>
                                                <TableHead className="w-20">Satuan</TableHead>
                                                <TableHead className="w-20">Kal/100g</TableHead>
                                                <TableHead className="w-20">Pro/100g</TableHead>
                                                <TableHead className="w-20">Lem/100g</TableHead>
                                                <TableHead className="w-20">Krb/100g</TableHead>
                                                <TableHead className="w-28">Harga/Satuan</TableHead>
                                                <TableHead className="w-10" />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bahans.map((bahan, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="p-1.5"><Input className="h-8 text-sm" value={bahan.nama_bahan} onChange={e => updateBahan(idx, 'nama_bahan', e.target.value)} /></TableCell>
                                                    <TableCell className="p-1.5"><Input className="h-8 text-sm" type="number" min={0} value={bahan.jumlah} onChange={e => updateBahan(idx, 'jumlah', parseFloat(e.target.value) || 0)} /></TableCell>
                                                    <TableCell className="p-1.5"><Input className="h-8 text-sm" value={bahan.satuan} onChange={e => updateBahan(idx, 'satuan', e.target.value)} /></TableCell>
                                                    <TableCell className="p-1.5"><Input className="h-8 text-sm" type="number" min={0} value={bahan.kalori_per_100g} onChange={e => updateBahan(idx, 'kalori_per_100g', parseFloat(e.target.value) || 0)} /></TableCell>
                                                    <TableCell className="p-1.5"><Input className="h-8 text-sm" type="number" min={0} value={bahan.protein_per_100g} onChange={e => updateBahan(idx, 'protein_per_100g', parseFloat(e.target.value) || 0)} /></TableCell>
                                                    <TableCell className="p-1.5"><Input className="h-8 text-sm" type="number" min={0} value={bahan.lemak_per_100g} onChange={e => updateBahan(idx, 'lemak_per_100g', parseFloat(e.target.value) || 0)} /></TableCell>
                                                    <TableCell className="p-1.5"><Input className="h-8 text-sm" type="number" min={0} value={bahan.karbohidrat_per_100g} onChange={e => updateBahan(idx, 'karbohidrat_per_100g', parseFloat(e.target.value) || 0)} /></TableCell>
                                                    <TableCell className="p-1.5"><Input className="h-8 text-sm" type="number" min={0} value={bahan.harga_per_satuan} onChange={e => updateBahan(idx, 'harga_per_satuan', parseFloat(e.target.value) || 0)} /></TableCell>
                                                    <TableCell className="p-1.5">
                                                        <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => removeBahan(idx)} disabled={bahans.length === 1}>
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right: Live Summary */}
                        <div className="space-y-4">
                            <Card className="sticky top-6">
                                <CardHeader><CardTitle className="text-sm">Ringkasan Per Porsi (Live)</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-center">
                                        <ValidationBadge status={validationStatus} />
                                    </div>

                                    {(['kalori', 'protein', 'lemak', 'karbohidrat'] as const).map(key => {
                                        const val = liveTotals[key];
                                        const std = standarForSelected ? (standarForSelected as any)[key] as number : null;
                                        const ok = std !== null ? val >= std : null;
                                        const pct = std ? Math.min((val / std) * 100, 100) : 100;
                                        const unit = key === 'kalori' ? 'kcal' : 'g';
                                        return (
                                            <div key={key} className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-medium capitalize">{key}</span>
                                                    <span className={ok === true ? 'text-green-600' : ok === false ? 'text-red-500' : 'text-muted-foreground'}>
                                                        {val} {unit}
                                                        {std && <span className="text-muted-foreground"> / min {std}</span>}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all ${ok === true ? 'bg-green-500' : ok === false ? 'bg-red-400' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="border-t pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Harga / Porsi</span>
                                            <span className="font-bold text-lg">Rp {Number(liveTotals.harga).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                                            <span>Total Biaya Batch</span>
                                            <span>Rp {(Number(liveTotals.harga) * Math.max(data.jumlah_porsi, 1)).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    {standarForSelected && (
                                        <div className="rounded-md bg-muted/40 p-3 space-y-1">
                                            <p className="text-xs font-semibold text-muted-foreground mb-2">Standar BGN — {data.kelompok_usia}</p>
                                            {(['kalori', 'protein', 'lemak', 'karbohidrat'] as const).map(k => (
                                                <div key={k} className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground capitalize">Min. {k}</span>
                                                    <span className="font-medium">{(standarForSelected as any)[k]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
