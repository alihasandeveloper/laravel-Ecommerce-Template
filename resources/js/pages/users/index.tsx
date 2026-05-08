import { Form, Head, Link } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    role_label: string;
};

export default function UsersIndex({ users }: { users: User[] }) {
    return (
        <>
            <Head title="Users" />

            <div className="space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Heading
                        title="Users"
                        description="Manage backend users and privileges."
                    />

                    <Button asChild>
                        <Link href={UserController.create()}>
                            <Plus />
                            Add user
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b last:border-b-0"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {user.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.role_label}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link
                                                    href={UserController.edit(
                                                        user.id,
                                                    )}
                                                >
                                                    <Pencil />
                                                    Edit
                                                </Link>
                                            </Button>

                                            <Form
                                                {...UserController.destroy.form(
                                                    user.id,
                                                )}
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                                onSubmit={(event) => {
                                                    if (
                                                        !confirm(
                                                            'Delete this user?',
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
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: UserController.index(),
        },
    ],
};
