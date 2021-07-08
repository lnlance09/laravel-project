<?php

namespace Database\Factories;

use App\Models\Coin;
use App\Models\Prediction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PredictionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Prediction::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;
        $coin = current(Coin::all()->random(1)->toArray());
        $user = current(User::all()->random(1)->toArray());

        return [
            'coin_id' => $coin['id'],
            'current_price' => $faker->numberBetween(1000000, 9999999999),
            'margin' => rand(1, 4000) / 10,
            'prediction_price' => $faker->numberBetween(1000000, 9999999999),
            'status' => 'Completed',
            'target_date' => $faker->dateTimeBetween('-6 months', '-7 days'),
            'user_id' => $user['id']
        ];
    }
}
