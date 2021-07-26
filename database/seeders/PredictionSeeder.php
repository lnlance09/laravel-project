<?php

namespace Database\Seeders;

use App\Models\Prediction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PredictionSeeder extends Seeder
{
    const PREDICTION_COUNT = 300;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (env('SEED_WITH_IMPORTS', 0) == 1) {
            DB::unprepared(file_get_contents(__DIR__ . '/imports/predictions.sql'));
            return;
        }

        Prediction::factory()->count(self::PREDICTION_COUNT)->create();
    }
}
