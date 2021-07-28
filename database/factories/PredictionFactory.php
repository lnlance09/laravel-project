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

        $createdAt = $faker->dateTimeBetween('-35 minutes', '-5 minutes');
        $currentPrice = (float) Coin::getPriceAtTimeCMC($coin['cmc_id'], $createdAt->getTimestamp());
        $targetDate = $faker->dateTimeBetween('+14 days', '+30 months');

        $margin = mt_rand(51, 5000) / 10;
        if (mt_rand(1, 10) > 7) {
            $margin = mt_rand(-900, -50) / 10;
        }

        // TODO: find out default values
        if ($margin > 0) {
            $predictionPrice = '';
        }

        return [
            'actual_price' => null,
            'coin_id' => $coin['id'],
            'created_at' => $createdAt,
            'current_price' => $currentPrice,
            'margin' => null,
            // 'prediction_price' => $predictionPrice,
            'status' => 'Pending',
            'target_date' => $targetDate,
            'user_id' => $user['id']
        ];
    }
}
