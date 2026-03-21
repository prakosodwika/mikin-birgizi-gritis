// resources/js/pages/Kabupaten/Index.tsx
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
import KabupatenForm from './Form';
import {
  index as kabupatenIndexRoute,
  store as kabupatenStoreRoute,
  update as kabupatenUpdateRoute,
  destroy as kabupatenDestroyRoute,
  show as kabupatenShowRoute
} from '@/routes/kabupaten';

interface Kabupaten {
  id: number;
  name: string;
  provinsi_id: number;
  provinsi?: {
    id: number;
    name: string;
  };
}

interface Provinsi {
  id: number;
  name: string;
}

interface Props {
  kabupaten: {
    data: Kabupaten[];
    current_page: number;
    last_page: number;
    total: number;
  };
  provinsis: Provinsi[];
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
    title: 'Kabupaten',
    href: '/kabupaten',
  },
];

export default function KabupatenIndex({ kabupaten, provinsis, filters }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKabupaten, setEditingKabupaten] = useState<Kabupaten | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: '',
    provinsi_id: provinsis[0]?.id || '',
  });

  const openCreateDialog = () => {
    setEditingKabupaten(null);
    reset();
    clearErrors();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Kabupaten) => {
    setEditingKabupaten(item);
    setData({
      name: item.name,
      provinsi_id: item.provinsi_id,
    });
    clearErrors();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKabupaten) {
      put(kabupatenUpdateRoute(editingKabupaten.id).url, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        },
      });
    } else {
      post(kabupatenStoreRoute().url, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kabupaten ini?')) {
      router.delete(kabupatenDestroyRoute(id).url);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(kabupatenIndexRoute().url, { search: searchTerm }, { preserveState: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Kabupaten" />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Kabupaten</h1>
            <p className="text-muted-foreground text-sm">
              Kelola data kabupaten/kota dan relasinya dengan provinsi.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Tambah Kabupaten
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Cari nama kabupaten..."
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
                <TableHead>Nama Kabupaten</TableHead>
                <TableHead>Provinsi</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {kabupaten.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Tidak ada data kabupaten ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                kabupaten.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.provinsi?.name || '-'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.visit(kabupatenShowRoute(item.id).url)}>
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
            <DialogTitle>{editingKabupaten ? 'Ubah Kabupaten' : 'Tambah Kabupaten'}</DialogTitle>
            <DialogDescription>
              {editingKabupaten ? 'Ubah informasi kabupaten di bawah ini.' : 'Masukkan informasi untuk membuat kabupaten baru.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <KabupatenForm data={data} setData={setData} errors={errors} provinsis={provinsis} />
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
