import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProgramGizi, StandarGizi } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import {
    index as programGiziIndex,
    create as programGiziCreate,
    show as programGiziShow,
} from '@/routes/pengelola/program-gizi';

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

interface Props {
    programs: Record<string, ProgramGizi[]>;
    standar_gizi: StandarGizi[];
    year: number;
    month: number;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Program Gizi', href: '/pengelola/program-gizi' }];

function StatusBadge({ status }: { status: ProgramGizi['status_validasi'] }) {
    if (status === 'valid') return (
        <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 text-[10px]">
            <CheckCircle className="size-2.5" /> Lolos
        </Badge>
    );
    if (status === 'invalid') return (
        <Badge className="bg-red-100 text-red-700 border-red-200 gap-1 text-[10px]">
            <XCircle className="size-2.5" /> Gagal
        </Badge>
    );
    return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1 text-[10px]">
            <Clock className="size-2.5" /> Pending
        </Badge>
    );
}

export default function ProgramGiziIndex({ programs, year, month }: Props) {
    // Build calendar grid
    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const days: (Date | null)[] = [];

        for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month - 1, d));
        }
        while (days.length % 7 !== 0) days.push(null);
        return days;
    }, [year, month]);

    const navigateMonth = (delta: number) => {
        let newMonth = month + delta;
        let newYear = year;
        if (newMonth < 1) { newMonth = 12; newYear--; }
        if (newMonth > 12) { newMonth = 1; newYear++; }
        router.get(programGiziIndex().url, { year: newYear, month: newMonth }, { preserveState: false });
    };

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Program Gizi" />
            <div className="flex flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Program Gizi</h1>
                        <p className="text-sm text-muted-foreground">
                            Rencanakan menu harian. Sistem otomatis memvalidasi standar gizi BGN.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                                <ChevronLeft className="size-4" />
                            </Button>
                            <span className="font-semibold min-w-36 text-center text-sm">
                                {MONTH_NAMES[month - 1]} {year}
                            </span>
                            <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                        <Button onClick={() => router.visit(programGiziCreate().url)}>
                            <Plus data-icon="inline-start" />
                            Tambah Program
                        </Button>
                    </div>
                </div>

                {/* Calendar */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 border-b bg-muted/30">
                        {DAY_NAMES.map((day) => (
                            <div key={day} className="py-2.5 text-center text-xs font-semibold text-muted-foreground">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, idx) => {
                            if (!day) {
                                return <div key={`empty-${idx}`} className="min-h-28 border-r border-b bg-muted/10" />;
                            }

                            const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                            const dayPrograms = programs[dateStr] || [];
                            const isToday = dateStr === todayStr;
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                            return (
                                <div
                                    key={dateStr}
                                    className={`min-h-28 border-r border-b p-1.5 flex flex-col gap-1 group transition-colors cursor-pointer hover:bg-primary/5 ${isWeekend ? 'bg-muted/15' : ''}`}
                                    onClick={() => router.visit(`${programGiziCreate().url}?tanggal=${dateStr}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-semibold rounded-full size-6 flex items-center justify-center ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                                            {day.getDate()}
                                        </span>
                                        <Plus className="size-3 text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity" />
                                    </div>

                                    {dayPrograms.map((program) => (
                                        <div
                                            key={program.id}
                                            className="rounded-md px-1.5 py-1 text-[10px] bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.visit(programGiziShow(program.id).url);
                                            }}
                                        >
                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                <span className="font-semibold truncate text-primary/80">{program.nama_program}</span>
                                                <Eye className="size-2.5 shrink-0 text-muted-foreground" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <StatusBadge status={program.status_validasi} />
                                                <span className="text-muted-foreground">Rp {Number(program.harga_per_porsi).toLocaleString('id-ID')}/porsi</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><CheckCircle className="size-3 text-green-600" /> Lolos Standar BGN</div>
                    <div className="flex items-center gap-1.5"><XCircle className="size-3 text-red-500" /> Gagal Standar BGN</div>
                    <div className="flex items-center gap-1.5"><Clock className="size-3 text-yellow-500" /> Belum Divalidasi</div>
                    <div className="flex items-center gap-1.5 ml-auto">Klik tanggal untuk tambah program</div>
                </div>
            </div>
        </AppLayout>
    );
}
