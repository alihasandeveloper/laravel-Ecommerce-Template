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

type Product = {
    id: number;
    category_id: number;
    name: string;
    price: string;
    description: string | null;
    stock: number;
    image: string | null;
    image_url: string | null;
    images: {
        id: number;
        url: string;
    }[];
    category_ids: number[];
};

export default function ProductsEdit({
    product,
    categories,
}: {
    product: Product;
    categories: Category[];
}) {
    return (
        <>
            <Head title={`Edit ${product.name}`} />

            <div className="max-w-3xl space-y-6 p-4">
                <Heading
                    title="Edit product"
                    description="Update product details and inventory."
                />

                <Form
                    {...ProductController.update.form(product.id)}
                    className="space-y-6"
                >
                    {({ processing, errors, progress }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={product.name}
                                    required
                                    autoFocus
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
                                                defaultChecked={product.category_ids.includes(
                                                    category.id,
                                                )}
                                                className="size-4 rounded border-input"
                                            />
                                            <span>{category.name}</span>
                                        </label>
                                    ))}
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
                                        defaultValue={product.price}
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
                                        defaultValue={product.stock}
                                        required
                                    />
                                    <InputError message={errors.stock} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="images">Gallery</Label>
                                {product.images.length > 0 && (
                                    <div className="grid gap-3 rounded-md border p-3 sm:grid-cols-2 md:grid-cols-3">
                                        {product.images.map((image) => (
                                            <label
                                                key={image.id}
                                                className="space-y-2 text-sm"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={product.name}
                                                    className="aspect-square w-full rounded-md object-cover"
                                                />
                                                <span className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        name="remove_image_ids[]"
                                                        value={image.id}
                                                        className="size-4 rounded border-input"
                                                    />
                                                    Remove
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                <Input
                                    id="images"
                                    name="images[]"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                />
                                <InputError message={errors.images} />
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
                                    defaultValue={product.description ?? ''}
                                    className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex gap-3">
                                <Button disabled={processing}>
                                    Save changes
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

ProductsEdit.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: ProductController.index(),
        },
        {
            title: 'Edit product',
            href: '#',
        },
    ],
};
