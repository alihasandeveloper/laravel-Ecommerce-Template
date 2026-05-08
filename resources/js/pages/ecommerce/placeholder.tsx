import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

export default function EcommercePlaceholder({ title }: { title: string }) {
    return (
        <>
            <Head title={title} />

            <div className="space-y-6 p-4">
                <Heading
                    title={title}
                    description="This ecommerce module is ready for backend workflows."
                />

                <div className="rounded-lg border border-sidebar-border/70 p-6 text-sm text-muted-foreground dark:border-sidebar-border">
                    No records yet.
                </div>
            </div>
        </>
    );
}

EcommercePlaceholder.layout = {
    breadcrumbs: [
        {
            title: 'Ecommerce',
            href: '#',
        },
    ],
};
