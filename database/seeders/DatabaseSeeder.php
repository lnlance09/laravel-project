<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        if (env('SEED_WITH_IMPORTS', 0) == 1) {
            $seeders = [
                CoinSeeder::class,
                UserSeeder::class,
                PredictionSeeder::class
            ];
        } else {
            $seeders = [
                CoinSeeder::class,
                UserSeeder::class
            ];
        }

        $this->call($seeders);
    }
}
