
import { router } from '@inertiajs/react';
import { AlertTriangle, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {show as satuanPelayananShow } from '@/routes/satuan-pelayanan';

import type { SatuanPelayananPemenuhanGiziPagination } from '@/types/models/satuanPelayananPemenuhanGizi';

interface Props {
    satuanPelayananPemenuhanGizis: SatuanPelayananPemenuhanGiziPagination;
    openEditDialog: (item: any) => void;
    handleDelete: (item: any) => void;
}

export default function SatuanPelayananTable({
    satuanPelayananPemenuhanGizis,
    openEditDialog,
    handleDelete,
}: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama Unit</TableHead>
                    <TableHead>Wilayah</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {satuanPelayananPemenuhanGizis.data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            Tidak ada data satuan pelayanan ditemukan.
                        </TableCell>
                    </TableRow>
                ) : (
                    satuanPelayananPemenuhanGizis.data.map((unit) => (
                        <TableRow key={unit.id} className={unit.flagged_at ? "bg-destructive/5" : ""}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    {unit.name}
                                    {unit.flagged_at && (
                                        <AlertTriangle className="size-4 text-destructive" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col text-xs">
                                    <span>{unit.kabupaten?.name || '-'}</span>
                                    <span className="text-muted-foreground">{unit.provinsi?.name || '-'}</span>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{unit.address}</TableCell>
                            <TableCell>{unit.contact_number || '-'}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <Badge variant={unit.status === 'active' ? 'default' : 'destructive'}>
                                        {unit.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                    {unit.flagged_at && (
                                        <Badge variant="destructive" className="text-[10px] py-0">Flagged</Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => router.visit(satuanPelayananShow(unit.id).url)}>
                                            Detail
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openEditDialog(unit)}>
                                            Ubah
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => handleDelete(unit.id)}
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
    );
}
