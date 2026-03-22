// resources/js/pages/Kecamatan/Show.tsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

import { index as kecamatanIndexRoute } from '@/routes/kecamatan';
import type { BreadcrumbItem } from '@/types';
import type { Kecamatan } from '@/types/models/regions';

interface Props {
    kecamatan: Kecamatan;
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
    {
        title: 'Detail Kecamatan',
        href: '#',
    },
];

export default function KecamatanShow({ kecamatan }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Kecamatan: ${kecamatan.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={kecamatanIndexRoute().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Detail Kecamatan</h1>
                        <p className="text-muted-foreground text-sm">Informasi lengkap data kecamatan.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Umum</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">ID Kecamatan</p>
                                <p className="text-base">{kecamatan.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nama Kecamatan</p>
                                <p className="text-base">{kecamatan.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kabupaten</p>
                                <p className="text-base">{kecamatan.kabupaten?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Provinsi</p>
                                <p className="text-base">{kecamatan.kabupaten?.provinsi?.name || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
