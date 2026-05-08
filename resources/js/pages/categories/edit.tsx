import { Form, Head, Link } from '@inertiajs/react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Category = {
    id: number;
    name: string;
    slug: string;
};

export default function CategoriesEdit({ category }: { category: Category }) {
    return (
        <>
            <Head title={`Edit ${category.name}`} />

            <div className="max-w-2xl space-y-6 p-4">
                <Heading
                    title="Edit category"
                    description="Update category details."
                />

                <Form
                    {...CategoryController.update.form(category.id)}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={category.name}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    defaultValue={category.slug}
                                    required
                                />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="flex gap-3">
                                <Button disabled={processing}>
                                    Save changes
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={CategoryController.index()}>
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

CategoriesEdit.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: CategoryController.index(),
        },
        {
            title: 'Edit category',
            href: '#',
        },
    ],
};
