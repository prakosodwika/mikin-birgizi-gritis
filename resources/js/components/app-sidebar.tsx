import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, School, Building2, Users, Map } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as userIndex } from '@/routes/users';
import { index as satuanPelayananIndex } from '@/routes/satuan-pelayanan';
import { index as provinsiIndexRoute } from '@/routes/provinsi';
import { index as kabupatenIndexRoute } from '@/routes/kabupaten';
import { index as kecamatanIndexRoute } from '@/routes/kecamatan';
import { index as sekolahIndexRoute } from '@/routes/sekolah';
import { index as standarGiziIndex } from '@/routes/standar-gizi';
import { index as pengelolaSekolahIndexRoute } from '@/routes/pengelola/sekolah';
import { index as pengelolaProgramGiziIndexRoute } from '@/routes/pengelola/program-gizi';
import type { NavItem } from '@/types';
import { usePage } from '@inertiajs/react';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<any>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
            icon: LayoutGrid,
        },
    ];

    if (auth.user?.role === 'badan_gizi_nasional') {
        mainNavItems.push({
            title: 'Satuan Pelayanan',
            href: satuanPelayananIndex().url,
            icon: Building2,
        });

        mainNavItems.push({
            title: 'Data Wilayah',
            href: '#',
            icon: Map,
            items: [
                {
                    title: 'Provinsi',
                    href: provinsiIndexRoute().url,
                },
                {
                    title: 'Kabupaten',
                    href: kabupatenIndexRoute().url,
                },
                {
                    title: 'Kecamatan',
                    href: kecamatanIndexRoute().url,
                },
                {
                    title: 'Sekolah',
                    href: sekolahIndexRoute().url,
                },
            ],
        });

        mainNavItems.push({
            title: 'Manajemen Pengguna',
            href: userIndex().url,
            icon: Users,
        });

        mainNavItems.push({
            title: 'Standar Gizi Nasional',
            href: standarGiziIndex().url,
            icon: BookOpen,
        });
    }

    if (auth.user?.role === 'operator_satuan_pelayanan_pemenuhan_gizi') {
        mainNavItems.push({
            title: 'Program Gizi',
            href: pengelolaProgramGiziIndexRoute().url,
            icon: BookOpen,
        });

        mainNavItems.push({
            title: 'Sekolah Saya',
            href: pengelolaSekolahIndexRoute().url,
            icon: School,
        });
    }


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
