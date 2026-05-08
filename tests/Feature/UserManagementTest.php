<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Support\Facades\Hash;

test('users must be admins to manage users', function () {
    $regularUser = User::factory()->create();

    $this->actingAs($regularUser)
        ->get(route('users.index'))
        ->assertForbidden();
});

test('admins can view user pages', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin);

    $this->get(route('users.index'))->assertOk();
    $this->get(route('users.create'))->assertOk();
    $this->get(route('users.edit', $user))->assertOk();
});

test('admins can manage users and roles', function () {
    $this->withoutMiddleware(PreventRequestForgery::class);

    $admin = User::factory()->admin()->create();
    $this->actingAs($admin);

    $this->post(route('users.store'), [
        'name' => 'Store Manager',
        'email' => 'manager@example.com',
        'role' => UserRole::Admin->value,
        'password' => 'password',
    ])->assertRedirect(route('users.index'));

    $user = User::where('email', 'manager@example.com')->firstOrFail();

    expect($user->role)->toBe(UserRole::Admin)
        ->and(Hash::check('password', $user->password))->toBeTrue();

    $this->put(route('users.update', $user), [
        'name' => 'Customer Support',
        'email' => 'support@example.com',
        'role' => UserRole::User->value,
        'password' => '',
    ])->assertRedirect(route('users.index'));

    expect($user->refresh())
        ->name->toBe('Customer Support')
        ->email->toBe('support@example.com')
        ->role->toBe(UserRole::User);

    $this->delete(route('users.destroy', $user))
        ->assertRedirect(route('users.index'));

    $this->assertModelMissing($user);
});
