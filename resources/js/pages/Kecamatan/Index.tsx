// resources/js/pages/Kecamatan/Index.tsx
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

import {
    index as kecamatanIndexRoute,
    store as kecamatanStoreRoute,
    update as kecamatanUpdateRoute,
    destroy as kecamatanDestroyRoute,
} from '@/routes/kecamatan';

import type { BreadcrumbItem } from '@/types';
import type { Kabupaten, Kecamatan, Provinsi } from '@/types/models/regions';
import KecamatanForm from './Form';
import KecamatanTable from './Table';

interface Props {
    kecamatan: {
        data: Kecamatan[];
        current_page: number;
        last_page: number;
        total: number;
    };
    kabupatens: Kabupaten[];
    provinsis: Provinsi[];
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Wilayah',
        href: '#',
    },
    {
        title: 'Kecamatan',
        href: '/kecamatan',
    },
];

export default function KecamatanIndex({ kecamatan, kabupatens, provinsis, filters }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingKecamatan, setEditingKecamatan] = useState<Kecamatan | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        kabupaten_id: kabupatens[0]?.id || '',
        provinsi_id: provinsis[0]?.id || '',
    });

    const openCreateDialog = () => {
        setEditingKecamatan(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: Kecamatan) => {
        setEditingKecamatan(item);
        setData({
            name: item.name,
            kabupaten_id: item.kabupaten_id,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingKecamatan) {
            put(kecamatanUpdateRoute(editingKecamatan.id).url, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post(kecamatanStoreRoute().url, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kecamatan ini?')) {
            router.delete(kecamatanDestroyRoute(id).url);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(kecamatanIndexRoute().url, { search: searchTerm }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Kecamatan" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Kecamatan</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola data kecamatan dan relasinya dengan kabupaten/kota.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 size-4" />
                        Tambah Kecamatan
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            placeholder="Cari nama kecamatan..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                <div className="rounded-md border">
                    <KecamatanTable
                        kecamatan={kecamatan}
                        openEditDialog={openEditDialog}
                        handleDelete={handleDelete}
                    />
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingKecamatan ? 'Ubah Kecamatan' : 'Tambah Kecamatan'}</DialogTitle>
                        <DialogDescription>
                            {editingKecamatan ? 'Ubah informasi kecamatan di bawah ini.' : 'Masukkan informasi untuk membuat kecamatan baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <KecamatanForm data={data} setData={setData} errors={errors} kabupatens={kabupatens} provinsis={provinsis} />
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
