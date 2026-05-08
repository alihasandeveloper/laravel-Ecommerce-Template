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
        'images' => [
            UploadedFile::fake()->image('headphones-front.jpg'),
            UploadedFile::fake()->image('headphones-side.jpg'),
        ],
    ])->assertRedirect(route('products.index'));

    $product = Product::where('name', 'Headphones')->firstOrFail();
    $this->assertModelExists($product);
    expect($product->images)->toHaveCount(2);
    Storage::disk('public')->assertExists($product->image);

    $originalImage = $product->image;
    $removedImage = $product->images->first();

    $this->post(route('products.update', $product), [
        '_method' => 'PUT',
        'category_id' => $category->id,
        'category_ids' => [$category->id],
        'name' => 'Studio Headphones',
        'price' => 129.99,
        'description' => 'Updated description.',
        'stock' => 8,
        'remove_image_ids' => [$removedImage->id],
        'images' => [
            UploadedFile::fake()->image('studio-headphones.jpg'),
        ],
    ])->assertRedirect(route('products.index'));

    expect($product->refresh()->load('images'))
        ->name->toBe('Studio Headphones')
        ->stock->toBe(8)
        ->images->toHaveCount(2);

    Storage::disk('public')->assertMissing($originalImage);
    Storage::disk('public')->assertExists($product->images->last()->path);

    $remainingImages = $product->images->pluck('path')->all();

    $this->delete(route('products.destroy', $product))
        ->assertRedirect(route('products.index'));

    $this->assertModelMissing($product);

    foreach ($remainingImages as $image) {
        Storage::disk('public')->assertMissing($image);
    }
});
