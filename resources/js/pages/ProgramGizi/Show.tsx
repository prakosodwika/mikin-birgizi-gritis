import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProgramGizi, StandarGizi } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { ArrowLeft, CheckCircle, XCircle, Clock, Pencil, Trash2 } from 'lucide-react';
import {
    index as programGiziIndex,
    edit as programGiziEdit,
    destroy as programGiziDestroy,
} from '@/routes/pengelola/program-gizi';

interface Props {
    program: ProgramGizi;
    standar_gizi: StandarGizi | null;
}

function StatusBadge({ status }: { status: ProgramGizi['status_validasi'] }) {
    if (status === 'valid') return (<Badge className="bg-green-100 text-green-700 border-green-200 gap-1"><CheckCircle className="size-3" /> Lolos Standar</Badge>);
    if (status === 'invalid') return (<Badge className="bg-red-100 text-red-700 border-red-200 gap-1"><XCircle className="size-3" /> Gagal Standar</Badge>);
    return (<Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1"><Clock className="size-3" /> Pending</Badge>);
}

function NutritionBar({ label, value, min, unit }: { label: string; value: number; min?: number; unit: string }) {
    const pct = min ? Math.min((value / min) * 100, 100) : 100;
    const ok = min ? value >= min : true;
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{label}</span>
                <span className={ok ? 'text-green-600' : 'text-red-500'}>
                    {value} {unit}
                    {min && <span className="text-muted-foreground"> / min {min}</span>}
                </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full transition-all ${ok ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

export default function ProgramGiziShow({ program, standar_gizi }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Program Gizi', href: programGiziIndex().url },
        { title: program.nama_program, href: '#' },
    ];

    const handleDelete = () => {
        router.delete(programGiziDestroy(program.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={program.nama_program} />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={programGiziIndex().url}><ArrowLeft className="size-4" /></Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold">{program.nama_program}</h1>
                                <StatusBadge status={program.status_validasi} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {new Date(program.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                {' · '}{program.kelompok_usia}
                                {' · '}{program.jumlah_porsi} porsi
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.visit(programGiziEdit(program.id).url)}>
                            <Pencil className="size-4 mr-2" /> Edit
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive"><Trash2 className="size-4 mr-2" /> Hapus</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Program Gizi?</AlertDialogTitle>
                                    <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Semua data komposisi bahan akan ikut terhapus.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Left: Nutrition + Ingredients */}
                    <div className="col-span-2 space-y-4">
                        <Card>
                            <CardHeader><CardTitle className="text-sm">Ringkasan Gizi Per Porsi</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <NutritionBar label="Kalori" value={Number(program.kalori_total)} min={standar_gizi?.kalori} unit="kcal" />
                                <NutritionBar label="Protein" value={Number(program.protein_total)} min={standar_gizi?.protein} unit="g" />
                                <NutritionBar label="Lemak" value={Number(program.lemak_total)} min={standar_gizi?.lemak} unit="g" />
                                <NutritionBar label="Karbohidrat" value={Number(program.karbohidrat_total)} min={standar_gizi?.karbohidrat} unit="g" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-sm">Komposisi Bahan ({program.bahans?.length || 0} bahan)</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bahan</TableHead>
                                            <TableHead>Jumlah</TableHead>
                                            <TableHead className="text-right">Kalori</TableHead>
                                            <TableHead className="text-right">Protein</TableHead>
                                            <TableHead className="text-right">Lemak</TableHead>
                                            <TableHead className="text-right">Karbo</TableHead>
                                            <TableHead className="text-right">Harga Bahan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(program.bahans || []).map((bahan) => {
                                            const j = Number(bahan.jumlah);
                                            return (
                                                <TableRow key={bahan.id}>
                                                    <TableCell className="font-medium">{bahan.nama_bahan}</TableCell>
                                                    <TableCell>{bahan.jumlah} {bahan.satuan}</TableCell>
                                                    <TableCell className="text-right">{((j / 100) * Number(bahan.kalori_per_100g)).toFixed(1)} kcal</TableCell>
                                                    <TableCell className="text-right">{((j / 100) * Number(bahan.protein_per_100g)).toFixed(1)} g</TableCell>
                                                    <TableCell className="text-right">{((j / 100) * Number(bahan.lemak_per_100g)).toFixed(1)} g</TableCell>
                                                    <TableCell className="text-right">{((j / 100) * Number(bahan.karbohidrat_per_100g)).toFixed(1)} g</TableCell>
                                                    <TableCell className="text-right">Rp {(j * Number(bahan.harga_per_satuan)).toLocaleString('id-ID')}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Cost + Standard info */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader><CardTitle className="text-sm">Biaya</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Jumlah Porsi</span>
                                    <span className="font-medium">{program.jumlah_porsi}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Biaya Batch</span>
                                    <span className="font-medium">Rp {(Number(program.harga_per_porsi) * program.jumlah_porsi).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between items-center">
                                    <span className="font-semibold">Harga / Porsi</span>
                                    <span className="font-bold text-primary text-lg">Rp {Number(program.harga_per_porsi).toLocaleString('id-ID')}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {standar_gizi && (
                            <Card>
                                <CardHeader><CardTitle className="text-sm">Standar BGN — {program.kelompok_usia}</CardTitle></CardHeader>
                                <CardContent className="space-y-2 text-xs">
                                    {(['kalori', 'protein', 'lemak', 'karbohidrat'] as const).map(k => (
                                        <div key={k} className="flex justify-between">
                                            <span className="text-muted-foreground capitalize">Min. {k}</span>
                                            <span className="font-medium">{(standar_gizi as any)[k]}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {program.catatan && (
                            <Card>
                                <CardHeader><CardTitle className="text-sm">Catatan</CardTitle></CardHeader>
                                <CardContent><p className="text-sm text-muted-foreground">{program.catatan}</p></CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
