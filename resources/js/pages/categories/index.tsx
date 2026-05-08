import { Form, Head, Link } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

type Category = {
    id: number;
    name: string;
    slug: string;
    assigned_products_count: number;
};

export default function CategoriesIndex({
    categories,
}: {
    categories: Category[];
}) {
    return (
        <>
            <Head title="Categories" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Heading
                        title="Categories"
                        description="Manage product categories."
                    />

                    <Button asChild>
                        <Link href={CategoryController.create()}>
                            <Plus />
                            Add category
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Slug</th>
                                <th className="px-4 py-3 font-medium">
                                    Products
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-b last:border-b-0"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {category.slug}
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.assigned_products_count}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link
                                                    href={CategoryController.edit(
                                                        category.id,
                                                    )}
                                                >
                                                    <Pencil />
                                                    Edit
                                                </Link>
                                            </Button>

                                            <Form
                                                {...CategoryController.destroy.form(
                                                    category.id,
                                                )}
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                                onSubmit={(event) => {
                                                    if (
                                                        !confirm(
                                                            'Delete this category?',
                                                        )
                                                    ) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled={processing}
                                                    >
                                                        <Trash2 />
                                                        Delete
                                                    </Button>
                                                )}
                                            </Form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: CategoryController.index(),
        },
    ],
};
