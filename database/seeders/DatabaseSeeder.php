<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'alihasan@boomdevs.com'],
            [
                'name' => 'Ali Hasan',
                'password' => 'password',
                'role' => UserRole::SuperAdmin,
                'email_verified_at' => now(),
            ],
        );
    }
}
