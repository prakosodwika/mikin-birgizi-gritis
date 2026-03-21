// resources/js/pages/Sekolah/Show.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, School, MapPin, Users, Building2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { index as sekolahIndexRoute } from '@/routes/sekolah';

interface Sekolah {
    id: number;
    name: string;
    address: string;
    level: string;
    total_students: number;
    kecamatan?: {
        id: number;
        name: string;
        kabupaten?: {
            id: number;
            name: string;
            provinsi?: {
                id: number;
                name: string;
            };
        };
    };
    satuan_pelayanan_pemenuhan_gizi?: {
        id: number;
        name: string;
    };
}

interface Props {
    sekolah: Sekolah;
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
    {
        title: 'Detail Sekolah',
        href: '#',
    },
];

export default function SekolahShow({ sekolah }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Sekolah: ${sekolah.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={sekolahIndexRoute().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Detail Sekolah</h1>
                        <p className="text-muted-foreground text-sm">Informasi lengkap data sekolah dan keterkaitannya.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <School className="size-5" />
                                Informasi Sekolah
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nama Sekolah</p>
                                    <p className="text-lg font-semibold">{sekolah.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tingkat Pendidikan</p>
                                    <Badge className="mt-1">{sekolah.level}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Jumlah Siswa</p>
                                    <div className="flex items-center gap-2 text-base font-medium">
                                        <Users className="text-muted-foreground size-4" />
                                        {sekolah.total_students} Siswa
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ID Sekolah</p>
                                    <p className="text-base">#{sekolah.id}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Alamat Lengkap</p>
                                <div className="flex items-start gap-2 text-base">
                                    <MapPin className="text-muted-foreground mt-1 size-4 shrink-0" />
                                    {sekolah.address}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Lokasi Wilayah</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Kecamatan</span>
                                    <span className="font-medium">{sekolah.kecamatan?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Kabupaten</span>
                                    <span className="font-medium">{sekolah.kecamatan?.kabupaten?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Provinsi</span>
                                    <span className="font-medium">{sekolah.kecamatan?.kabupaten?.provinsi?.name || '-'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Unit Gizi (SPPG)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 text-primary mt-0.5 rounded-full p-2">
                                        <Building2 className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {sekolah.satuan_pelayanan_pemenuhan_gizi?.name || 'Belum Dikaitkan'}
                                        </p>
                                        <p className="text-muted-foreground text-xs mt-0.5">
                                            {sekolah.satuan_pelayanan_pemenuhan_gizi ? 'Unit pelayanan aktif' : 'Sekolah belum memiliki penanggung jawab gizi'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
