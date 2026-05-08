import { Form, Head, Link } from '@inertiajs/react';
import CategoryController from '@/actions/App/Http/Controllers/CategoryController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CategoriesCreate() {
    return (
        <>
            <Head title="Add category" />

            <div className="max-w-2xl space-y-6 p-4">
                <Heading
                    title="Add category"
                    description="Create a category for grouping products."
                />

                <Form
                    {...CategoryController.store.form()}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    autoFocus
                                    placeholder="Electronics"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="electronics"
                                />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="flex gap-3">
                                <Button disabled={processing}>
                                    Save category
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

CategoriesCreate.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: CategoryController.index(),
        },
        {
            title: 'Add category',
            href: CategoryController.create(),
        },
    ],
};
