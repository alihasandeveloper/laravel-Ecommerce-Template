import { Link, usePage } from '@inertiajs/react';
import {
    BadgePercent,
    BarChart3,
    BookOpen,
    Boxes,
    FolderGit2,
    LayoutGrid,
    Package,
    ShoppingCart,
    Tags,
    Users,
    UserRound,
} from 'lucide-react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
import UserController from '@/actions/App/Http/Controllers/UserController';
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
import { index as couponsIndex } from '@/routes/coupons';
import { index as customersIndex } from '@/routes/customers';
import { index as inventoryIndex } from '@/routes/inventory';
import { index as ordersIndex } from '@/routes/orders';
import { index as reportsIndex } from '@/routes/reports';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const dashboardNavItem: NavItem = {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
};

const adminNavItems: NavItem[] = [
    {
        title: 'Users',
        href: UserController.index(),
        icon: Users,
    },
    {
        title: 'Products',
        href: ProductController.index(),
        icon: Package,
    },
    {
        title: 'Categories',
        href: CategoryController.index(),
        icon: Tags,
    },
    {
        title: 'Orders',
        href: ordersIndex(),
        icon: ShoppingCart,
    },
    {
        title: 'Customers',
        href: customersIndex(),
        icon: UserRound,
    },
    {
        title: 'Inventory',
        href: inventoryIndex(),
        icon: Boxes,
    },
    {
        title: 'Coupons',
        href: couponsIndex(),
        icon: BadgePercent,
    },
    {
        title: 'Reports',
        href: reportsIndex(),
        icon: BarChart3,
    },
];

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
    const { auth } = usePage().props;
    const isAdmin = ['super_admin', 'admin'].includes(
        String(auth.user.role ?? ''),
    );
    const mainNavItems = isAdmin
        ? [dashboardNavItem, ...adminNavItems]
        : [dashboardNavItem];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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
