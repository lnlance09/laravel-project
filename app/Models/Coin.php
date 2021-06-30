<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Http;
use Illuminate\Database\Eloquent\Model;

class Coin extends Model
{
    use HasFactory;

    const API_KEY = 'b81b2aab-80a9-4689-989c-8fde94c73c72';
    const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/';
    const HISTORICAL_URL = 'cryptocurrency/quotes/historical';
    const INFO_URL = 'cryptocurrency/info';
    const MAP_URL = 'cryptocurrency/map';

    public static function getAll($limit, $start)
    {
        $response = Http::withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => self::API_KEY
        ])->get(self::BASE_URL . self::MAP_URL, [
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

    public static function getHistorical($id)
    {
        $response = Http::withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => self::API_KEY
        ])->get(self::BASE_URL . self::HISTORICAL_URL, [
            'id' => $id
        ]);
        $json = $response->json();
        return $json;
    }

    public static function getInfo($symbol)
    {
        $response = Http::retry(3, 10000)->withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => self::API_KEY
        ])->get(self::BASE_URL . self::INFO_URL, [
            'symbol' => $symbol
        ]);

        if ($response->ok()) {
            $json = $response->json();
            $data = current($json['data']);
            return $data;
        }

        return false;
    }
}
