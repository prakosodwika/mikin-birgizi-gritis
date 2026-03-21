// resources/js/pages/SatuanPelayanan/Sekolah/Index.tsx
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import {
    index as pengelolaSekolahIndexRoute,
    show as pengelolaSekolahShowRoute
} from '@/routes/pengelola/sekolah';

interface Kecamatan {
    id: number;
    name: string;
}

interface Sekolah {
    id: number;
    name: string;
    address: string;
    level: string;
    total_students: number;
    kecamatan?: Kecamatan;
}

interface Props {
    sekolahs: {
        data: Sekolah[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        level?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sekolah',
        href: '/pengelola/sekolah',
    },
];

export default function SppgSekolahIndex({ sekolahs, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(pengelolaSekolahIndexRoute().url, { search: searchTerm }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Sekolah" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Sekolah Saya</h1>
                    <p className="text-muted-foreground text-sm">
                        Daftar sekolah yang berada di bawah pengelolaan Satuan Pelayanan Anda.
                    </p>
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
                                <TableHead>Jumlah Siswa</TableHead>
                                <TableHead className="w-10" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sekolahs.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
                                        <TableCell>{item.total_students} Siswa</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => router.visit(pengelolaSekolahShowRoute(item.id).url)}>
                                                <Eye className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
