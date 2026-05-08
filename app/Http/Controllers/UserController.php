<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('users/index', [
            'users' => User::query()
                ->latest()
                ->get(['id', 'name', 'email', 'role', 'created_at'])
                ->map(fn (User $user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'role_label' => $user->role->label(),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => $this->roles(),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        User::create($request->validated());

        return to_route('users.index');
    }

    public function show(User $user): RedirectResponse
    {
        return to_route('users.edit', $user);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
            ],
            'roles' => $this->roles(),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        if (blank($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return to_route('users.index');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->is(auth()->user()), 422);

        $user->delete();

        return to_route('users.index');
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function roles(): array
    {
        return collect(UserRole::cases())
            ->map(fn (UserRole $role): array => [
                'value' => $role->value,
                'label' => $role->label(),
            ])
            ->values()
            ->all();
    }
}
