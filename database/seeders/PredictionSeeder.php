<?php

namespace Database\Seeders;

use App\Models\Prediction;
use Illuminate\Database\Seeder;

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
        Prediction::factory()->count(self::PREDICTION_COUNT)->create();
    }
}
