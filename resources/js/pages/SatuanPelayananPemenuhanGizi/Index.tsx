import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Search, Building2, UserCog } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';

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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';

import {
    index as satuanPelayananIndex,
    store as satuanPelayananStore,
    update as satuanPelayananUpdate,
    destroy as satuanPelayananDestroy,
} from '@/routes/satuan-pelayanan';


import type { BreadcrumbItem } from '@/types';
import type { SatuanPelayananPemenuhanGizi, Provinsi, Kabupaten, Kecamatan } from '@/types/models';
import type { SatuanPelayananPemenuhanGiziPagination } from '@/types/models/satuanPelayananPemenuhanGizi';
import SatuanPelayananTable from './Table';

interface Props {
    satuanPelayananPemenuhanGizis: SatuanPelayananPemenuhanGiziPagination;
    provinsis: Provinsi[];
    kabupatens: Kabupaten[];
    kecamatans: Kecamatan[];
    filters: {
        search?: string;
        status?: string;
        provinsi_id?: string;
        kabupaten_id?: string;
        is_flagged?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Satuan Pelayanan',
        href: '/satuan-pelayanan',
    },
];

export default function SatuanPelayananIndex({ satuanPelayananPemenuhanGizis, provinsis, kabupatens, kecamatans, filters }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<SatuanPelayananPemenuhanGizi | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        address: '',
        provinsi_id: '' as string | number,
        kabupaten_id: '' as string | number,
        kecamatan_id: '' as string | number,
        contact_number: '',
        status: 'active' as 'active' | 'inactive',
        // Admin user fields
        admin_name: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirmation: '',
    });

    const openCreateDialog = () => {
        setEditingUnit(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (unit: SatuanPelayananPemenuhanGizi) => {
        setEditingUnit(unit);
        setData({
            name: unit.name,
            address: unit.address,
            provinsi_id: unit.provinsi_id || '',
            kabupaten_id: unit.kabupaten_id || '',
            kecamatan_id: unit.kecamatan_id || '',
            contact_number: unit.contact_number || '',
            status: unit.status,
            admin_name: '',
            admin_email: '',
            admin_password: '',
            admin_password_confirmation: '',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUnit) {
            put(satuanPelayananUpdate(editingUnit.id).url, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post(satuanPelayananStore().url, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus Satuan Pelayanan ini?')) {
            router.delete(satuanPelayananDestroy(id).url);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(satuanPelayananIndex().url, { search: searchTerm }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Satuan Pelayanan" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Satuan Pelayanan Pemenuhan Gizi</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola unit pelayanan, lokasi, dan akun operator unit.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 size-4" />
                        Tambah Satuan Pelayanan
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            placeholder="Cari nama atau alamat..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => router.get(satuanPelayananIndex().url, { ...filters, status: value === 'all' ? undefined : value }, { preserveState: true })}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.is_flagged || 'all'}
                        onValueChange={(value) => router.get(satuanPelayananIndex().url, { ...filters, is_flagged: value === 'all' ? undefined : value }, { preserveState: true })}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Flag" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Flag</SelectItem>
                            <SelectItem value="true">Flagged (Bermasalah)</SelectItem>
                            <SelectItem value="false">Tidak Bermasalah</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border">
                    <SatuanPelayananTable
                        satuanPelayananPemenuhanGizis={satuanPelayananPemenuhanGizis}
                        openEditDialog={openEditDialog}
                        handleDelete={handleDelete}
                    />
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUnit ? 'Ubah Satuan Pelayanan' : 'Tambah Satuan Pelayanan'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingUnit
                                ? 'Ubah informasi unit pelayanan di bawah ini.'
                                : 'Masukkan informasi unit dan akun operator yang akan dibuat secara otomatis.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        {/* Unit Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 font-medium text-sm">
                                <Building2 className="size-4" />
                                Informasi Satuan Pelayanan
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Satuan Pelayanan</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Satuan Pelayanan Jakarta Selatan 01"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat Lengkap</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Masukkan alamat lengkap unit"
                                />
                                <InputError message={errors.address} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="provinsi_id">Provinsi</Label>
                                    <Select
                                        value={data.provinsi_id.toString()}
                                        onValueChange={(value) => {
                                            setData((prev) => ({ ...prev, provinsi_id: value, kabupaten_id: '', kecamatan_id: '' }));
                                        }}
                                    >
                                        <SelectTrigger id="provinsi_id">
                                            <SelectValue placeholder="Pilih Provinsi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {provinsis.map((p) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.provinsi_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kabupaten_id">Kabupaten/Kota</Label>
                                    <Select
                                        value={data.kabupaten_id.toString()}
                                        onValueChange={(value) => {
                                            setData((prev) => ({ ...prev, kabupaten_id: value, kecamatan_id: '' }));
                                        }}
                                        disabled={!data.provinsi_id}
                                    >
                                        <SelectTrigger id="kabupaten_id">
                                            <SelectValue placeholder="Pilih Kabupaten" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kabupatens.filter(k => k.provinsi_id === Number(data.provinsi_id)).map((k) => (
                                                <SelectItem key={k.id} value={k.id.toString()}>{k.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.kabupaten_id} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kecamatan_id">Kecamatan</Label>
                                    <Select
                                        value={data.kecamatan_id.toString()}
                                        onValueChange={(value) => setData('kecamatan_id', value)}
                                        disabled={!data.kabupaten_id}
                                    >
                                        <SelectTrigger id="kecamatan_id">
                                            <SelectValue placeholder="Pilih Kecamatan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kecamatans.filter(kc => kc.kabupaten_id === Number(data.kabupaten_id)).map((kc) => (
                                                <SelectItem key={kc.id} value={kc.id.toString()}>{kc.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.kecamatan_id} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_number">Nomor Kontak</Label>
                                    <Input
                                        id="contact_number"
                                        value={data.contact_number}
                                        onChange={(e) => setData('contact_number', e.target.value)}
                                        placeholder="021-xxxxxx"
                                    />
                                    <InputError message={errors.contact_number} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status Unit</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: any) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Nonaktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>
                        </div>

                        {!editingUnit && (
                            <>
                                <Separator />
                                {/* Operator Account Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 font-medium text-sm">
                                        <UserCog className="size-4" />
                                        Informasi Akun Operator (Otomatis)
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_name">Nama Lengkap Operator</Label>
                                        <Input
                                            id="admin_name"
                                            value={data.admin_name}
                                            onChange={(e) => setData('admin_name', e.target.value)}
                                            placeholder="Nama penanggung jawab unit"
                                        />
                                        <InputError message={errors.admin_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_email">Email Operator</Label>
                                        <Input
                                            id="admin_email"
                                            type="email"
                                            value={data.admin_email}
                                            onChange={(e) => setData('admin_email', e.target.value)}
                                            placeholder="operator@unit.com"
                                        />
                                        <InputError message={errors.admin_email} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="admin_password">Kata Sandi</Label>
                                            <Input
                                                id="admin_password"
                                                type="password"
                                                value={data.admin_password}
                                                onChange={(e) => setData('admin_password', e.target.value)}
                                                placeholder="Min. 8 karakter"
                                            />
                                            <InputError message={errors.admin_password} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="admin_password_confirmation">Konfirmasi Kata Sandi</Label>
                                            <Input
                                                id="admin_password_confirmation"
                                                type="password"
                                                value={data.admin_password_confirmation}
                                                onChange={(e) => setData('admin_password_confirmation', e.target.value)}
                                                placeholder="Ulangi kata sandi"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Satuan Pelayanan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
