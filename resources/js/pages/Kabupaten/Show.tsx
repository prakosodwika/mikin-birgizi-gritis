// resources/js/pages/Kabupaten/Show.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { index as kabupatenIndexRoute } from '@/routes/kabupaten';

interface Kabupaten {
    id: number;
    name: string;
    provinsi_id: number;
    provinsi?: {
        id: number;
        name: string;
    };
}

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
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={kabupatenIndexRoute().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Detail Kabupaten</h1>
                        <p className="text-muted-foreground text-sm">Informasi lengkap data kabupaten/kota.</p>
                    </div>
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
                        <Separator />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
