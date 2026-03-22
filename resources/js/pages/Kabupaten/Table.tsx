import { router } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { show as kabupatenShowRoute } from '@/routes/kabupaten';
import type { KabupatenPaination } from '@/types/models/regions';

interface Props  {
    kabupaten: KabupatenPaination;
    openEditDialog: (item: any) => void;
    handleDelete: (item: any) => void;
}

export default function KabupatenTable({
    kabupaten,
    openEditDialog,
    handleDelete,
}: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama Kabupaten</TableHead>
                    <TableHead>Nama Provinsi</TableHead>
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
    );
}
