<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    Route::resource('users', UserController::class)->middleware('admin');

    Route::inertia('orders', 'ecommerce/placeholder', ['title' => 'Orders'])->name('orders.index');
    Route::inertia('customers', 'ecommerce/placeholder', ['title' => 'Customers'])->name('customers.index');
    Route::inertia('coupons', 'ecommerce/placeholder', ['title' => 'Coupons'])->name('coupons.index');
    Route::inertia('inventory', 'ecommerce/placeholder', ['title' => 'Inventory'])->name('inventory.index');
    Route::inertia('reports', 'ecommerce/placeholder', ['title' => 'Reports'])->name('reports.index');
});

require __DIR__.'/settings.php';
