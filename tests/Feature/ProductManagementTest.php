<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests are redirected from products', function () {
    $this->get(route('products.index'))->assertRedirect(route('login'));
});

test('authenticated users can view product pages', function () {
    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Audio',
        'slug' => 'audio',
    ]);
    $product = Product::create([
        'category_id' => $category->id,
        'name' => 'Headphones',
        'price' => 99.99,
        'description' => 'Noise cancelling headphones.',
        'stock' => 10,
        'image' => null,
    ]);
    $product->categories()->attach($category);

    $this->actingAs($user);

    $this->get(route('products.index'))->assertOk();
    $this->get(route('products.create'))->assertOk();
    $this->get(route('products.edit', $product))->assertOk();
});

test('authenticated users can manage products', function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    Storage::fake('public');

    $user = User::factory()->create();
    $category = Category::create([
        'name' => 'Audio',
        'slug' => 'audio',
    ]);

    $this->actingAs($user);

    $this->post(route('products.store'), [
        'category_id' => $category->id,
        'category_ids' => [$category->id],
        'name' => 'Headphones',
        'price' => 99.99,
        'description' => 'Noise cancelling headphones.',
        'stock' => 10,
        'image' => UploadedFile::fake()->image('headphones.jpg'),
    ])->assertRedirect(route('products.index'));

    $product = Product::where('name', 'Headphones')->firstOrFail();
    $this->assertModelExists($product);
    Storage::disk('public')->assertExists($product->image);

    $originalImage = $product->image;

    $this->post(route('products.update', $product), [
        '_method' => 'PUT',
        'category_id' => $category->id,
        'category_ids' => [$category->id],
        'name' => 'Studio Headphones',
        'price' => 129.99,
        'description' => 'Updated description.',
        'stock' => 8,
        'image' => UploadedFile::fake()->image('studio-headphones.jpg'),
    ])->assertRedirect(route('products.index'));

    expect($product->refresh())
        ->name->toBe('Studio Headphones')
        ->stock->toBe(8);

    Storage::disk('public')->assertMissing($originalImage);
    Storage::disk('public')->assertExists($product->image);

    $updatedImage = $product->image;

    $this->delete(route('products.destroy', $product))
        ->assertRedirect(route('products.index'));

    $this->assertModelMissing($product);
    Storage::disk('public')->assertMissing($updatedImage);
});
