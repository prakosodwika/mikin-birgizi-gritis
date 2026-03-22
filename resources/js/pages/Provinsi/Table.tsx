import { router } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { show as provinsiShowRoute } from '@/routes/provinsi';
import type { ProvinsiPagination } from '@/types/models/regions';

interface Props  {
    provinsi: ProvinsiPagination;
    openEditDialog: (item: any) => void;
    handleDelete: (item: any) => void;
}

export default function ProvinsiTable({
    provinsi,
    openEditDialog,
    handleDelete,
}: Props) {
    return (
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
    )
}
