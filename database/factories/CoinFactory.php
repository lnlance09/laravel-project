<?php

namespace Database\Factories;

use App\Models\Coin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CoinFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Coin::class;

    const CATEGORIES = [
        'coin',
        'token'
    ];

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = $this->faker;

        return [
            'category' => $faker->randomElement(self::CATEGORIES),
            'description' => $faker->sentence(1),
            'logo' => '',
            'market_cap' => $faker->numberBetween(1000000, 9999999999),
            'max_supply' => $faker->numberBetween(12000000, 120000000),
            'name' => $faker->company(),
            'slug' => Str::random(8),
            'symbol' => Str::random(3),
            'total_supply' => $faker->numberBetween(12000000, 120000000)
        ];
    }
}
