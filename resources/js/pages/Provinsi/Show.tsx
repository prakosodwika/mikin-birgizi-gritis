// resources/js/pages/Provinsi/Show.tsx
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

import { index as provinsiIndexRoute } from '@/routes/provinsi';
import type { BreadcrumbItem } from '@/types';
import type { Provinsi } from '@/types/models/regions';

interface Props {
    provinsi: Provinsi;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Wilayah',
        href: '#',
    },
    {
        title: 'Provinsi',
        href: '/provinsi',
    },
    {
        title: 'Detail Provinsi',
        href: '#',
    },
];

export default function ProvinsiShow({ provinsi }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Provinsi: ${provinsi.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Detail Provinsi</h1>
                        <p className="text-muted-foreground text-sm">Informasi lengkap data provinsi.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={provinsiIndexRoute().url}>
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
                                <p className="text-sm font-medium text-muted-foreground">ID Provinsi</p>
                                <p className="text-base">{provinsi.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nama Provinsi</p>
                                <p className="text-base">{provinsi.name}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
