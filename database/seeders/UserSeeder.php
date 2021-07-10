<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    const USER_COUNT = 25;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (env('SEED_WITH_IMPORTS', false)) {
            DB::unprepared(file_get_contents(__DIR__ . '/imports/users.sql'));
            return;
        }

        User::factory()->count(self::USER_COUNT)->create();
    }
}
