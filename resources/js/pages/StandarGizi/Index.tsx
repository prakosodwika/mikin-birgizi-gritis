import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, StandarGizi } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { History, Pencil } from 'lucide-react';
import { router } from '@inertiajs/react';
import { update as standarGiziUpdate, history as standarGiziHistory } from '@/routes/standar-gizi';

interface Props {
    standards: StandarGizi[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Standar Gizi Nasional',
        href: '/standar-gizi',
    },
];

export default function StandarGiziIndex({ standards }: Props) {
    const [editingStandard, setEditingStandard] = useState<StandarGizi | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        kalori: 0,
        protein: 0,
        lemak: 0,
        karbohidrat: 0,
        reason: '',
    });

    const openEditDialog = (standard: StandarGizi) => {
        setEditingStandard(standard);
        setData({
            kalori: standard.kalori,
            protein: standard.protein,
            lemak: standard.lemak,
            karbohidrat: standard.karbohidrat,
            reason: '',
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStandard) return;

        put(standarGiziUpdate(editingStandard.id).url, {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Standar Gizi Nasional" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Standar Gizi Nasional</h1>
                        <p className="text-sm text-muted-foreground">
                            Batas minimum gizi per kelompok usia yang harus dipenuhi oleh setiap SPPG.
                        </p>
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kelompok Usia</TableHead>
                                <TableHead className="text-right">Kalori (kcal)</TableHead>
                                <TableHead className="text-right">Protein (g)</TableHead>
                                <TableHead className="text-right">Lemak (g)</TableHead>
                                <TableHead className="text-right">Karbohidrat (g)</TableHead>
                                <TableHead className="w-24 text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {standards.map((standard) => (
                                <TableRow key={standard.id}>
                                    <TableCell className="font-medium">{standard.kelompok_usia}</TableCell>
                                    <TableCell className="text-right">{Number(standard.kalori).toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-right">{Number(standard.protein).toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-right">{Number(standard.lemak).toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-right">{Number(standard.karbohidrat).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(standard)}>
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => router.get(standarGiziHistory(standard.id).url)}>
                                                <History className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleUpdate}>
                            <DialogHeader>
                                <DialogTitle>Update Standar Gizi: {editingStandard?.kelompok_usia}</DialogTitle>
                                <DialogDescription>
                                    Perubahan ini akan dicatat dalam history untuk transparansi data.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="kalori">Kalori (kcal)</Label>
                                        <Input
                                            id="kalori"
                                            type="number"
                                            step="0.01"
                                            value={data.kalori}
                                            onChange={(e) => setData('kalori', parseFloat(e.target.value))}
                                        />
                                        {errors.kalori && <p className="text-xs text-destructive">{errors.kalori}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="protein">Protein (g)</Label>
                                        <Input
                                            id="protein"
                                            type="number"
                                            step="0.01"
                                            value={data.protein}
                                            onChange={(e) => setData('protein', parseFloat(e.target.value))}
                                        />
                                        {errors.protein && <p className="text-xs text-destructive">{errors.protein}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lemak">Lemak (g)</Label>
                                        <Input
                                            id="lemak"
                                            type="number"
                                            step="0.01"
                                            value={data.lemak}
                                            onChange={(e) => setData('lemak', parseFloat(e.target.value))}
                                        />
                                        {errors.lemak && <p className="text-xs text-destructive">{errors.lemak}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="karbohidrat">Karbohidrat (g)</Label>
                                        <Input
                                            id="karbohidrat"
                                            type="number"
                                            step="0.01"
                                            value={data.karbohidrat}
                                            onChange={(e) => setData('karbohidrat', parseFloat(e.target.value))}
                                        />
                                        {errors.karbohidrat && <p className="text-xs text-destructive">{errors.karbohidrat}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reason">Alasan Perubahan (Opsional)</Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Jelaskan alasan kenaikan/penurunan standar..."
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Update Standar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
