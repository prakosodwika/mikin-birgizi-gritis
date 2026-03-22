// resources/js/pages/Kabupaten/Show.tsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

import { index as kabupatenIndexRoute } from '@/routes/kabupaten';

import type { BreadcrumbItem } from '@/types';
import type { Kabupaten } from '@/types/models/regions';

interface Props {
    kabupaten: Kabupaten;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Wilayah',
        href: '#',
    },
    {
        title: 'Kabupaten',
        href: '/kabupaten',
    },
    {
        title: 'Detail Kabupaten',
        href: '#',
    },
];

export default function KabupatenShow({ kabupaten }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Kabupaten: ${kabupaten.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Detail Kabupaten</h1>
                        <p className="text-muted-foreground text-sm">Informasi lengkap data kabupaten/kota.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={kabupatenIndexRoute().url}>
                            <ArrowLeft className="size-4" />
                            Back
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Umum</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">ID Kabupaten</p>
                                <p className="text-base">{kabupaten.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nama Kabupaten</p>
                                <p className="text-base">{kabupaten.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Provinsi</p>
                                <p className="text-base">{kabupaten.provinsi?.name || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
