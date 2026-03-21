// resources/js/pages/Provinsi/Show.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { index as provinsiIndexRoute } from '@/routes/provinsi';

interface Provinsi {
    id: number;
    name: string;
}

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
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={provinsiIndexRoute().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Detail Provinsi</h1>
                        <p className="text-muted-foreground text-sm">Informasi lengkap data provinsi.</p>
                    </div>
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
                        <Separator />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
