import { Form, Head, Link } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Role = {
    value: string;
    label: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function UsersEdit({
    user,
    roles,
}: {
    user: User;
    roles: Role[];
}) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />

            <div className="max-w-2xl space-y-6 p-4">
                <Heading
                    title="Edit user"
                    description="Update backend user privileges."
                />

                <Form
                    {...UserController.update.form(user.id)}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={user.name}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={user.email}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    name="role"
                                    defaultValue={user.role}
                                    required
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex gap-3">
                                <Button disabled={processing}>
                                    Save changes
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={UserController.index()}>
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

UsersEdit.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: UserController.index(),
        },
        {
            title: 'Edit user',
            href: '#',
        },
    ],
};
