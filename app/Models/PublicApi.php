<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PublicApi extends Model
{
    const API_KEY = 'b81b2aab-80a9-4689-989c-8fde94c73c72';
    const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/';

    /**
     * Get all of the coins from CMC
     * 
     * @param $limit - int
     * @param $start - int
     * @return $coins - array
     */
    public static function getAll($limit, $start = 1)
    {
        $response = Http::withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => self::API_KEY
        ])->get(self::BASE_URL . 'cryptocurrency/map', [
            'start' => $start,
            'limit' => $limit,
            'sort' => 'cmc_rank'
        ]);

        if ($response->ok()) {
            $json = $response->json();
            $coins = $json['data'];
            return $coins;
        }

        return false;
    }

    /**
     * Get a coin's historical price data from CMC
     * 
     * @param $id - str
     * @return $json - json
     */
    public static function getHistorical($id)
    {
        $response = Http::withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => self::API_KEY
        ])->get(self::BASE_URL . 'cryptocurrency/quotes/historical', [
            'id' => $id
        ]);
        $json = $response->json();
        return $json;
    }

    /**
     * Get a coin's info from CMC
     * 
     * @param $symbol - str
     * @return $data - bool|array
     */
    public static function getInfo($symbol)
    {
        $response = Http::retry(3, 10000)->withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => self::API_KEY
        ])->get(self::BASE_URL . 'cryptocurrency/info', [
            'symbol' => $symbol
        ]);

        if ($response->ok()) {
            $json = $response->json();
            $data = current($json['data']);
            return $data;
        }

        return false;
    }

    /**
     * Get a coin's extended info from CMC
     * 
     * @param $id - str
     * @return $data - bool|array
     */
    public static function getExtendedInfo($id)
    {
        $response = Http::retry(3, 1000)->withHeaders([
            'accepts' => 'application/json',
            'origin' => 'https://coinmarketcap.com',
            'referer' => 'https://coinmarketcap.com/',
            'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
        ])->get('https://web-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', [
            'id' => $id,
            'convert_id' => 2781 // This might be USD
        ]);

        if ($response->ok()) {
            $json = $response->json();
            $data = current($json['data']);
            return $data;
        }

        Log::info($response->json());
        return false;
    }

    public static function getGraphData($id, $range)
    {
        $response = Http::retry(3, 10000)->withHeaders([
            'Accepts' => 'application/json',
        ])->get('https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart', [
            'id' => $id,
            'range' => $range
        ]);

        if ($response->ok()) {
            $json = $response->json();
            $points = $json['data']['points'];
            return $points;
        }

        return null;
    }

    /**
     * Get a coin's price at a given time
     * 
     * @param $coin - str
     * @param $time - int
     * @return $price - int
     */
    public static function getPriceAtTime($coin, $time)
    {
        $response = Http::retry(3, 10000)->withHeaders([
            'Accepts' => 'application/json',
        ])->get('https://poloniex.com/public', [
            'command' => 'returnChartData',
            'currencyPair' => 'USDT_' . $coin,
            'end' => strtotime('+1 day', $time),
            'start' => $time,
            'period' => 300
        ]);

        if ($response->ok()) {
            $json = $response->json();
            if (count($json) === 0) {
                return 0;
            }

            $current = current($json);
            if ($current === 'Invalid currency pair.') {
                return 0;
            }

            $price = $current['weightedAverage'];
            return $price;
        }

        return 0;
    }

    /**
     * Get a coin's price at a given time
     * 
     * @param $coin - str
     * @param $time - int
     * @return $price - int
     */
    public static function getPriceAtTimeCMC($id, $time)
    {
        $response = Http::retry(3, 10000)->withHeaders([
            'Accepts' => 'application/json',
        ])->get('https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart', [
            'id' => $id,
            'range' => $time . '~' . strtotime('+30 minutes', $time)
        ]);

        if ($response->ok()) {
            $json = $response->json();
            $points = $json['data']['points'];
            $current = current($points);

            if (!$current) {
                return false;
            }

            $price = $current['v'][0];
            return $price;
        }

        return false;
    }
}
