<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('products/index', [
            'products' => Product::query()
                ->with('categories:id,name')
                ->latest()
                ->get(['id', 'category_id', 'name', 'price', 'stock', 'image', 'created_at'])
                ->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'image' => $product->image,
                    'image_url' => $product->image ? Storage::disk('public')->url($product->image) : null,
                    'categories' => $product->categories->map->only(['id', 'name'])->values(),
                ]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('products/create', [
            'categories' => $this->categoriesForSelect(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request): RedirectResponse
    {
        $categoryIds = $request->validated('category_ids');
        $product = Product::create($this->validatedProductData($request, $categoryIds));
        $product->categories()->sync($categoryIds);

        return to_route('products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): RedirectResponse
    {
        return to_route('products.edit', $product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('products/edit', [
            'product' => [
                ...$product->only(['id', 'category_id', 'name', 'price', 'description', 'stock', 'image']),
                'image_url' => $product->image ? Storage::disk('public')->url($product->image) : null,
                'category_ids' => $product->categories()->pluck('categories.id'),
            ],
            'categories' => $this->categoriesForSelect(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $categoryIds = $request->validated('category_ids');
        $data = $this->validatedProductData($request, $categoryIds);

        if ($request->hasFile('image') && $product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->update($data);
        $product->categories()->sync($categoryIds);

        return to_route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return to_route('products.index');
    }

    /**
     * @return Collection<int, Category>
     */
    private function categoriesForSelect(): Collection
    {
        return Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedProductData(ProductRequest $request, array $categoryIds): array
    {
        $data = $request->validated();

        unset($data['image']);
        unset($data['category_ids']);

        $data['category_id'] = $categoryIds[0];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        return $data;
    }
}
