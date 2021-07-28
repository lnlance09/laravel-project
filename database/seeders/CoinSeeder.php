<?php

namespace Database\Seeders;

use App\Models\Coin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CoinSeeder extends Seeder
{
    const COIN_COUNT = 125;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // if (env('SEED_WITH_IMPORTS', 0) == 1) {
        DB::unprepared(file_get_contents(__DIR__ . '/imports/coins.sql'));
        return;
        // }

        $coins = (array) Coin::getAll(self::COIN_COUNT);
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

            sleep(2);

            $data = Coin::getInfo($symbol);
            if (!$data) {
                echo 'break';
                break;
            }

            $extendedData = Coin::getExtendedInfo($data['id']);
            if (!$extendedData) {
                echo 'break';
                break;
            }

            $dailyVolume = 0;
            $marketCap = 0;
            $lastPrice = null;
            $hourlyPercentChange = null;
            $dailyPercentChange = null;
            $weeklyPercentChange = null;
            $monthlyPercentChange = null;
            $biMonthlyPercentChange = null;
            $triMonthlyPercentChange = null;

            if (count($extendedData['quote']) === 1) {
                $quote = current($extendedData['quote']);
                $lastPrice = $quote['price'];
                $marketCap = $quote['market_cap'];
                $hourlyPercentChange = $quote['percent_change_1h'];
                $dailyPercentChange = $quote['percent_change_24h'];
                $weeklyPercentChange = $quote['percent_change_7d'];
                $monthlyPercentChange = $quote['percent_change_30d'];
                $biMonthlyPercentChange = $quote['percent_change_60d'];
                $triMonthlyPercentChange = $quote['percent_change_90d'];
                $dailyVolume = $quote['volume_24h'];
            }

            $category = $data['category'];
            $circulatingSupply = $extendedData['circulating_supply'];
            $cmcId = $data['id'];
            $description = $data['description'];
            $logo = $data['logo'];
            $maxSupply = $extendedData['max_supply'];
            $name = $data['name'];
            $slug = $data['slug'];
            $symbol = $data['symbol'];
            $tags = $data['tags'];
            $totalSupply = $extendedData['total_supply'];

            // don't store stablecoins
            if (
                is_array($tags) &&
                (array_search('stablecoin', $tags)
                    || array_search('stablecoin-algorithmically-stabilized', $tags)
                    || array_search('stablecoin-asset-backed', $tags))
            ) {
                continue;
            }

            $img = 'coins/' . Str::random(24) . '.png';
            $contents = file_get_contents($logo);
            Storage::disk('s3')->put($img, $contents);

            Coin::factory()->create([
                'category' => $category,
                'circulating_supply' => $circulatingSupply,
                'cmc_id' => $cmcId,
                'description' => $description,
                'last_price' => $lastPrice,
                'logo' => $img,
                'market_cap' => $marketCap,
                'max_supply' => $maxSupply,
                'name' => $name,
                'percent_change_1h' => $hourlyPercentChange,
                'percent_change_24h' => $dailyPercentChange,
                'percent_change_7d' => $weeklyPercentChange,
                'percent_change_30d' => $monthlyPercentChange,
                'percent_change_60d' => $biMonthlyPercentChange,
                'percent_change_90d' => $triMonthlyPercentChange,
                'slug' => $slug,
                'symbol' => $symbol,
                'total_supply' => $totalSupply,
                'volume_24h' => $dailyVolume
            ]);
        }
    }
}
