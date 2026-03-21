// resources/js/pages/Sekolah/Index.tsx
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import SekolahForm from './Form';
import {
    index as sekolahIndexRoute,
    store as sekolahStoreRoute,
    update as sekolahUpdateRoute,
    destroy as sekolahDestroyRoute,
    show as sekolahShowRoute
} from '@/routes/sekolah';

interface Kecamatan {
    id: number;
    name: string;
}

interface Sppg {
    id: number;
    name: string;
}

interface Sekolah {
    id: number;
    name: string;
    address: string;
    level: string;
    total_students: number;
    kecamatan_id: number;
    satuan_pelayanan_pemenuhan_gizi_id: number | null;
    kecamatan?: Kecamatan;
    satuan_pelayanan_pemenuhan_gizi?: Sppg;
}

interface Props {
    sekolahs: {
        data: Sekolah[];
        current_page: number;
        last_page: number;
        total: number;
    };
    kecamatans: Kecamatan[];
    sppgs: Sppg[];
    filters: {
        search?: string;
        level?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Wilayah',
        href: '#',
    },
    {
        title: 'Sekolah',
        href: '/sekolah',
    },
];

export default function SekolahIndex({ sekolahs, kecamatans, sppgs, filters }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSekolah, setEditingSekolah] = useState<Sekolah | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        address: '',
        level: 'SD',
        total_students: 0,
        kecamatan_id: kecamatans[0]?.id || '',
        satuan_pelayanan_pemenuhan_gizi_id: null as number | null,
    });

    const openCreateDialog = () => {
        setEditingSekolah(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: Sekolah) => {
        setEditingSekolah(item);
        setData({
            name: item.name,
            address: item.address,
            level: item.level,
            total_students: item.total_students,
            kecamatan_id: item.kecamatan_id,
            satuan_pelayanan_pemenuhan_gizi_id: item.satuan_pelayanan_pemenuhan_gizi_id,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSekolah) {
            put(sekolahUpdateRoute(editingSekolah.id).url, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post(sekolahStoreRoute().url, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus sekolah ini?')) {
            router.delete(sekolahDestroyRoute(id).url);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(sekolahIndexRoute().url, { search: searchTerm }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Sekolah" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Sekolah</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola data sekolah, tingkat pendidikan, dan pembagian unit gizi.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 size-4" />
                        Tambah Sekolah
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            placeholder="Cari nama atau alamat sekolah..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Sekolah</TableHead>
                                <TableHead>Tingkat</TableHead>
                                <TableHead>Kecamatan</TableHead>
                                <TableHead>Siswa</TableHead>
                                <TableHead>Unit Gizi (SPPG)</TableHead>
                                <TableHead className="w-10" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sekolahs.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        Tidak ada data sekolah ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sekolahs.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-muted-foreground text-xs">{item.address}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.level}</Badge>
                                        </TableCell>
                                        <TableCell>{item.kecamatan?.name || '-'}</TableCell>
                                        <TableCell>{item.total_students}</TableCell>
                                        <TableCell>{item.satuan_pelayanan_pemenuhan_gizi?.name || '-'}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.visit(sekolahShowRoute(item.id).url)}>
                                                        Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                                        Ubah
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingSekolah ? 'Ubah Sekolah' : 'Tambah Sekolah'}</DialogTitle>
                        <DialogDescription>
                            {editingSekolah ? 'Ubah informasi sekolah di bawah ini.' : 'Masukkan informasi untuk membuat sekolah baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <SekolahForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            kecamatans={kecamatans}
                            sppgs={sppgs}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={processing}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
