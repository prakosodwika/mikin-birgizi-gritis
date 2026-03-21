// resources/js/pages/Provinsi/Index.tsx
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import ProvinsiForm from './Form';
import {
  index as provinsiIndexRoute,
  store as provinsiStoreRoute,
  update as provinsiUpdateRoute,
  destroy as provinsiDestroyRoute,
  show as provinsiShowRoute
} from '@/routes/provinsi';

interface Provinsi {
  id: number;
  name: string;
}

interface Props {
  provinsi: {
    data: Provinsi[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filters: {
    search?: string;
  };
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
];

export default function ProvinsiIndex({ provinsi, filters }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvinsi, setEditingProvinsi] = useState<Provinsi | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: '',
  });

  const openCreateDialog = () => {
    setEditingProvinsi(null);
    reset();
    clearErrors();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Provinsi) => {
    setEditingProvinsi(item);
    setData({
      name: item.name,
    });
    clearErrors();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProvinsi) {
      put(provinsiUpdateRoute(editingProvinsi.id).url, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        },
      });
    } else {
      post(provinsiStoreRoute().url, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus provinsi ini?')) {
      router.delete(provinsiDestroyRoute(id).url);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(provinsiIndexRoute().url, { search: searchTerm }, { preserveState: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Provinsi" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Provinsi</h1>
            <p className="text-muted-foreground text-sm">
              Kelola data provinsi untuk standarisasi wilayah nasional.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Tambah Provinsi
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Cari nama provinsi..."
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
                <TableHead>Nama Provinsi</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {provinsi.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    Tidak ada data provinsi ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                provinsi.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.visit(provinsiShowRoute(item.id).url)}>
                            Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(item)}>
                            Ubah
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
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
            <DialogTitle>{editingProvinsi ? 'Ubah Provinsi' : 'Tambah Provinsi'}</DialogTitle>
            <DialogDescription>
              {editingProvinsi ? 'Ubah informasi provinsi di bawah ini.' : 'Masukkan informasi untuk membuat provinsi baru.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <ProvinsiForm data={data} setData={setData} errors={errors} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={processing}>
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
