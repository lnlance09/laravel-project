<?php

namespace Database\Seeders;

use App\Models\Coin;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    const COIN_COUNT = 300;

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $coins = Coin::getAll(self::COIN_COUNT, 1);

        if (!$coins) {
            die('There was an error fetching coins');
        }

        $count = count($coins);

        for ($i = 0; $i < $count; $i++) {
            $item = $coins[$i];
            $symbol = $item['symbol'];

            $exists = Coin::select('id')->where('symbol', $symbol)->exists();
            if ($exists) {
                continue;
            }

            sleep(1);

            $data = Coin::getInfo($symbol);
            if (!$data) {
                echo 'break';
                break;
            }

            $category = $data['category'];
            $description = $data['description'];
            $logo = $data['logo'];
            $name = $data['name'];
            $slug = $data['slug'];
            $symbol = $data['symbol'];
            $tags = $data['tags'];

            Coin::factory()->create([
                'category' => $category,
                'description' => $description,
                'logo' => $logo,
                // 'market_cap' => '',
                //'max_supply' => '',
                'name' => $name,
                'slug' => $slug,
                'symbol' => $symbol,
                // 'total_supply' => ''
            ]);
        }
    }
}
