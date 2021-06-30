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
        return [
            'category' => $this->faker->randomElement(self::CATEGORIES),
            'description' => $this->faker->sentence(1),
            'logo' => '',
            'market_cap' => $this->faker->numberBetween(1000000, 9999999999),
            'max_supply' => $this->faker->numberBetween(12000000, 120000000),
            'name' => $this->faker->company(),
            'slug' => Str::random(8),
            'symbol' => Str::random(3),
            'total_supply' => $this->faker->numberBetween(12000000, 120000000)
        ];
    }
}
