import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, StandarGizi, StandarGiziHistory } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    standard: StandarGizi;
    history: StandarGiziHistory[];
}

export default function StandarGiziHistoryPage({ standard, history }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Standar Gizi Nasional',
            href: '/standar-gizi',
        },
        {
            title: `Riwayat: ${standard.kelompok_usia}`,
            href: `/standar-gizi/${standard.id}/history`,
        },
    ];

    const renderTrend = (oldVal: number, newVal: number) => {
        if (newVal > oldVal) return <ArrowUpRight className="size-4 text-green-500" />;
        if (newVal < oldVal) return <ArrowDownRight className="size-4 text-destructive" />;
        return <Minus className="size-4 text-muted-foreground" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Riwayat Standar Gizi - ${standard.kelompok_usia}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/standar-gizi">
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Riwayat Perubahan Standar Gizi</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelompok Usia: <span className="font-medium text-foreground">{standard.kelompok_usia}</span>
                        </p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {history.length === 0 ? (
                        <Card>
                            <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
                                Belum ada riwayat perubahan untuk kelompok usia ini.
                            </CardContent>
                        </Card>
                    ) : (
                        history.map((record) => (
                            <Card key={record.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/30 py-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium">
                                            Diperbarui oleh {record.user?.name}
                                        </CardTitle>
                                        <Badge variant="outline" className="font-normal">
                                            {new Date(record.created_at).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid gap-6 md:grid-cols-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Kalori</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm line-through text-muted-foreground">
                                                    {record.old_values?.kalori}
                                                </span>
                                                {renderTrend(record.old_values?.kalori || 0, record.new_values.kalori)}
                                                <span className="font-semibold">{record.new_values.kalori} kcal</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Protein</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm line-through text-muted-foreground">
                                                    {record.old_values?.protein}
                                                </span>
                                                {renderTrend(record.old_values?.protein || 0, record.new_values.protein)}
                                                <span className="font-semibold">{record.new_values.protein} g</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Lemak</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm line-through text-muted-foreground">
                                                    {record.old_values?.lemak}
                                                </span>
                                                {renderTrend(record.old_values?.lemak || 0, record.new_values.lemak)}
                                                <span className="font-semibold">{record.new_values.lemak} g</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Karbohidrat</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm line-through text-muted-foreground">
                                                    {record.old_values?.karbohidrat}
                                                </span>
                                                {renderTrend(record.old_values?.karbohidrat || 0, record.new_values.karbohidrat)}
                                                <span className="font-semibold">{record.new_values.karbohidrat} g</span>
                                            </div>
                                        </div>
                                    </div>

                                    {record.reason && (
                                        <div className="mt-6 rounded-md bg-muted/50 p-4 border-l-4 border-primary/50">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Catatan Perubahan:</p>
                                            <p className="text-sm italic">"{record.reason}"</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
