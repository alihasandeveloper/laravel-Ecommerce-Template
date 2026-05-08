<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

test('guests are redirected from categories', function () {
    $this->get(route('categories.index'))->assertRedirect(route('login'));
});

test('authenticated users can view category pages', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Audio',
        'slug' => 'audio',
    ]);

    $this->actingAs($user);

    $this->get(route('categories.index'))->assertOk();
    $this->get(route('categories.create'))->assertOk();
    $this->get(route('categories.edit', $category))->assertOk();
});

test('authenticated users can manage categories', function () {
    $this->withoutMiddleware(PreventRequestForgery::class);

    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('categories.store'), [
        'name' => 'Kitchen Tools',
    ])->assertRedirect(route('categories.index'));

    $category = Category::where('slug', 'kitchen-tools')->firstOrFail();
    $this->assertModelExists($category);

    $this->put(route('categories.update', $category), [
        'name' => 'Kitchen Gear',
        'slug' => 'kitchen-gear',
    ])->assertRedirect(route('categories.index'));

    expect($category->refresh()->slug)->toBe('kitchen-gear');

    $this->delete(route('categories.destroy', $category))
        ->assertRedirect(route('categories.index'));

    $this->assertModelMissing($category);
});
