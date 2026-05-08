import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

type Product = {
    id: number;
    name: string;
    price: string;
    stock: number;
    image: string | null;
    image_url: string | null;
    categories: {
        id: number;
        name: string;
    }[];
};

export default function ProductsIndex({ products }: { products: Product[] }) {
    return (
        <>
            <Head title="Products" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Heading
                        title="Products"
                        description="Manage store products."
                    />

                    <Button asChild>
                        <Link href={ProductController.create()}>
                            <Plus />
                            Add product
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Image</th>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">
                                    Category
                                </th>
                                <th className="px-4 py-3 font-medium">Price</th>
                                <th className="px-4 py-3 font-medium">Stock</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b last:border-b-0"
                                >
                                    <td className="px-4 py-3">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="size-12 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="size-12 rounded-md border border-dashed bg-muted/30" />
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {product.categories.length > 0
                                            ? product.categories
                                                  .map(
                                                      (category) =>
                                                          category.name,
                                                  )
                                                  .join(', ')
                                            : 'Unassigned'}
                                    </td>
                                    <td className="px-4 py-3">
                                        ${product.price}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.stock}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link
                                                    href={ProductController.edit(
                                                        product.id,
                                                    )}
                                                >
                                                    <Pencil />
                                                    Edit
                                                </Link>
                                            </Button>

                                            <Form
                                                {...ProductController.destroy.form(
                                                    product.id,
                                                )}
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                                onSubmit={(event) => {
                                                    if (
                                                        !confirm(
                                                            'Delete this product?',
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
                            {products.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No products found.
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

ProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: ProductController.index(),
        },
    ],
};
