<?php

namespace Database\Factories;

use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

class WalletFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Wallet::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $wallet = Wallet::createNew();

        return [
            'address' => $wallet['address'],
            'private_key' => $wallet['privateKey'],
            'public_key' => $wallet['publicKey']
        ];
    }
}
