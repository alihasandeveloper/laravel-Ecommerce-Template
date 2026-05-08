import { Form, Head, Link } from '@inertiajs/react';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Category = {
    id: number;
    name: string;
};

export default function ProductsCreate({
    categories,
}: {
    categories: Category[];
}) {
    return (
        <>
            <Head title="Add product" />

            <div className="max-w-3xl space-y-6 p-4">
                <Heading
                    title="Add product"
                    description="Create a product and assign it to a category."
                />

                <Form {...ProductController.store.form()} className="space-y-6">
                    {({ processing, errors, progress }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    autoFocus
                                    placeholder="Wireless headphones"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Categories</Label>
                                <div className="grid gap-2 rounded-md border p-3 md:grid-cols-2">
                                    {categories.map((category) => (
                                        <label
                                            key={category.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                name="category_ids[]"
                                                value={category.id}
                                                className="size-4 rounded border-input"
                                            />
                                            <span>{category.name}</span>
                                        </label>
                                    ))}
                                    {categories.length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            Add a category before creating
                                            products.
                                        </p>
                                    )}
                                </div>
                                <InputError message={errors.category_ids} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        defaultValue="0"
                                        required
                                    />
                                    <InputError message={errors.stock} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Image</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                />
                                <InputError message={errors.image} />
                            </div>

                            {progress && (
                                <progress
                                    value={progress.percentage}
                                    max="100"
                                    className="h-2 w-full"
                                >
                                    {progress.percentage}%
                                </progress>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex gap-3">
                                <Button disabled={processing}>
                                    Save product
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={ProductController.index()}>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

ProductsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: ProductController.index(),
        },
        {
            title: 'Add product',
            href: ProductController.create(),
        },
    ],
};
