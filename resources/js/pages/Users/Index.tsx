import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type AppUser } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search, Filter, History } from 'lucide-react';
import { SatuanPelayananPemenuhanGizi } from '@/types/models';
import InputError from '@/components/input-error';
import { index as userIndex, store as userStore, update as userUpdate, destroy as userDestroy } from '@/routes/users';

interface Props {
    users: {
        data: AppUser[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    satuan_pelayanan_pemenuhan_gizis: {
        data: SatuanPelayananPemenuhanGizi[];
    };
    filters: {
        search?: string;
        role?: string;
        status?: string;
        satuan_pelayanan_pemenuhan_gizi_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '/user-management',
    },
];

export default function UserIndex({ users, satuan_pelayanan_pemenuhan_gizis, filters }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AppUser | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        email: string;
        password?: string;
        password_confirmation?: string;
        role: AppUser['role'];
        satuan_pelayanan_pemenuhan_gizi_id: string | number;
        status: AppUser['status'];
    }>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'badan_gizi_nasional',
        satuan_pelayanan_pemenuhan_gizi_id: '',
        status: 'active',
    });

    const openCreateDialog = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (user: AppUser) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.role,
            satuan_pelayanan_pemenuhan_gizi_id: user.satuan_pelayanan_pemenuhan_gizi_id || '',
            status: user.status,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(userUpdate(editingUser.id).url, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            post(userStore().url, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(userDestroy(id).url);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(userIndex().url, { search: searchTerm }, { preserveState: true });
    };

    const getRoleBadge = (role: AppUser['role']) => {
        switch (role) {
            case 'badan_gizi_nasional':
                return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Badan Gizi Nasional</Badge>;
            case 'operator_satuan_pelayanan_pemenuhan_gizi':
                return <Badge variant="default">Operator SPPG</Badge>;
            case 'auditor_independen':
                return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">Auditor Independen</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
        router.get(userIndex().url, newFilters, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Manajemen Pengguna</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola akun pengguna, peran, dan akses sistem.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 size-4" />
                        Tambah Pengguna
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            placeholder="Cari nama atau email..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    <Select
                        value={filters.role || 'all'}
                        onValueChange={(value) => handleFilterChange('role', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Semua Peran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Peran</SelectItem>
                            <SelectItem value="badan_gizi_nasional">Badan Gizi Nasional</SelectItem>
                            <SelectItem value="operator_satuan_pelayanan_pemenuhan_gizi">Operator SPPG</SelectItem>
                            <SelectItem value="auditor_independen">Auditor Independen</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => handleFilterChange('status', value)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.satuan_pelayanan_pemenuhan_gizi_id || 'all'}
                        onValueChange={(value) => handleFilterChange('satuan_pelayanan_pemenuhan_gizi_id', value)}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Unit</SelectItem>
                            {satuan_pelayanan_pemenuhan_gizis.data.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id.toString()}>
                                    {unit.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {(filters.search || filters.role || filters.status || filters.satuan_pelayanan_pemenuhan_gizi_id) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearchTerm('');
                                router.get(userIndex().url);
                            }}
                        >
                            Reset Filter
                        </Button>
                    )}
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Peran & Unit</TableHead>
                                <TableHead>Terakhir Login</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-10"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        Tidak ada data pengguna ditemukan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {getRoleBadge(user.role)}
                                                <span className="text-xs text-muted-foreground">
                                                    {user.satuan_pelayanan_pemenuhan_gizi?.name || 'Pusat'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <History className="size-3" />
                                                <span>
                                                    {user.last_login_at
                                                        ? new Date(user.last_login_at).toLocaleString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                        : 'Belum pernah'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className="rounded-full px-2 py-0">
                                                {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                        Ubah
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Ubah Pengguna' : 'Tambah Pengguna'}</DialogTitle>
                        <DialogDescription>
                            {editingUser
                                ? 'Ubah informasi akun pengguna di bawah ini.'
                                : 'Masukkan informasi untuk membuat akun pengguna baru.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="nama@domain.com"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'Min. 8 karakter'}
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Peran Pengguna</Label>
                            <Select
                                value={data.role}
                                onValueChange={(value: any) => setData('role', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="badan_gizi_nasional">Badan Gizi Nasional</SelectItem>
                                    <SelectItem value="operator_satuan_pelayanan_pemenuhan_gizi">
                                        Operator Satuan Pelayanan
                                    </SelectItem>
                                    <SelectItem value="auditor_independen">Auditor Independen</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        {data.role === 'operator_satuan_pelayanan_pemenuhan_gizi' && (
                            <div className="space-y-2">
                                <Label htmlFor="satuan_pelayanan_pemenuhan_gizi_id">
                                    Satuan Pelayanan Pemenuhan Gizi
                                </Label>
                                <Select
                                    value={data.satuan_pelayanan_pemenuhan_gizi_id.toString()}
                                    onValueChange={(value) => setData('satuan_pelayanan_pemenuhan_gizi_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih satuan pelayanan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {satuan_pelayanan_pemenuhan_gizis.data.map((unit) => (
                                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                                {unit.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.satuan_pelayanan_pemenuhan_gizi_id} />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="status">Status Akun</Label>
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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={processing}
                            >
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
