// resources/js/pages/SatuanPelayananPemenuhanGizi/Show.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Users, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import {
    index as satuanPelayananIndex,
    flag as satuanPelayananFlag,
    unflag as satuanPelayananUnflag
} from '@/routes/satuan-pelayanan';
import { useForm, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { SatuanPelayananPemenuhanGizi, AppUser } from '@/types/models';

interface Props {
    auth: {
        user: AppUser;
    };
    satuan_pelayanan: SatuanPelayananPemenuhanGizi & {
        users?: Array<AppUser>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Satuan Pelayanan',
        href: '/satuan-pelayanan',
    },
    {
        title: 'Detail Satuan Pelayanan',
        href: '#',
    },
];

export default function SatuanPelayananShow({ auth, satuan_pelayanan }: Props) {
    const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
    const isAuditor = auth.user.role === 'auditor_independen';

    const flagForm = useForm({
        flag_note: '',
    });

    const handleFlag = (e: FormEvent) => {
        e.preventDefault();
        flagForm.post(satuanPelayananFlag(satuan_pelayanan.id).url, {
            onSuccess: () => {
                setIsFlagDialogOpen(false);
                flagForm.reset();
            },
        });
    };

    const handleUnflag = () => {
        if (confirm('Apakah Anda yakin ingin menghapus tanda (flag) pada unit ini?')) {
            router.post(satuanPelayananUnflag(satuan_pelayanan.id).url);
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Satuan Pelayanan: ${satuan_pelayanan.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={satuanPelayananIndex().url}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Detail Satuan Pelayanan</h1>
                        <p className="text-muted-foreground text-sm">Informasi lengkap unit pelayanan pemenuhan gizi.</p>
                    </div>
                </div>

                {satuan_pelayanan.flagged_at && (
                    <div className="flex items-start gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                        <AlertTriangle className="mt-0.5 size-5 text-destructive" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-destructive">Unit Ditandai (Flagged)</h3>
                            <p className="text-sm text-destructive/80">
                                Ditandai pada {new Date(satuan_pelayanan.flagged_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            {satuan_pelayanan.flag_note && (
                                <div className="mt-2 text-sm italic border-l-2 border-destructive/20 pl-4 py-1">
                                    "{satuan_pelayanan.flag_note}"
                                </div>
                            )}
                        </div>
                        {isAuditor && (
                            <Button variant="outline" size="sm" onClick={handleUnflag} className="border-destructive/20 text-destructive hover:bg-destructive/10">
                                Hapus Flag
                            </Button>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="size-5" />
                                Informasi Unit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nama Unit</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base font-medium">{satuan_pelayanan.name}</p>
                                        {satuan_pelayanan.flagged_at && (
                                            <Badge variant="destructive">Flagged</Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge variant={satuan_pelayanan.status === 'active' ? 'default' : 'destructive'}>
                                        {satuan_pelayanan.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Alamat Lengkap</p>
                                <p className="text-base">{satuan_pelayanan.address}</p>
                                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="size-4" />
                                    <span>{satuan_pelayanan.kecamatan?.name}, {satuan_pelayanan.kabupaten?.name}, {satuan_pelayanan.provinsi?.name}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nomor Kontak</p>
                                <p className="text-base">{satuan_pelayanan.contact_number || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="size-5" />
                                    Operator Unit
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {satuan_pelayanan.users && satuan_pelayanan.users.length > 0 ? (
                                    <div className="space-y-4">
                                        {satuan_pelayanan.users.map((user) => (
                                            <div key={user.id} className="flex flex-col gap-1">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Belum ada operator yang ditugaskan.</p>
                                )}
                            </CardContent>
                        </Card>

                        {isAuditor && !satuan_pelayanan.flagged_at && (
                            <Card className="border-destructive/20 bg-destructive/5">
                                <CardHeader>
                                    <CardTitle className="text-destructive flex items-center gap-2">
                                        <AlertTriangle className="size-5" />
                                        Audit Audit Unit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Jika Anda menemukan ketidaksesuaian atau kecurigaan pada data unit ini, Anda dapat memberikan tanda (flag) yang akan memicu notifikasi ke BGN.
                                    </p>
                                    <Dialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" className="w-full">
                                                Tandai Unit Bermasalah
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <form onSubmit={handleFlag}>
                                                <DialogHeader>
                                                    <DialogTitle>Tandai Unit Bermasalah</DialogTitle>
                                                    <DialogDescription>
                                                        Berikan penjelasan mengapa unit ini ditandai. Penjelasan ini akan dilihat oleh BGN.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4 space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="flag_note">Catatan Audit</Label>
                                                        <Textarea
                                                            id="flag_note"
                                                            placeholder="Jelaskan temuan Anda..."
                                                            value={flagForm.data.flag_note}
                                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => flagForm.setData('flag_note', e.target.value)}
                                                            rows={4}
                                                        />
                                                        <InputError message={flagForm.errors.flag_note} />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" variant="outline" onClick={() => setIsFlagDialogOpen(false)}>
                                                        Batal
                                                    </Button>
                                                    <Button type="submit" variant="destructive" disabled={flagForm.processing}>
                                                        Kirim Flag
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
