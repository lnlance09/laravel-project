<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Http;
use Illuminate\Database\Eloquent\Model;

class Coin extends Model
{
    use HasFactory;

    const API_BASE_URL = 'https://pro-api.coinmarketcap.com/v1/';
    const API_KEY = 'b81b2aab-80a9-4689-989c-8fde94c73c72';
    const CURRENT_PRICE_URL = 'cryptocurrency/listings/latest';

    public function getCurrentPrice()
    {
        $response = Http::withHeaders([
            'Accepts: application/json',
            'X-CMC_PRO_API_KEY: ' . $this->API_KEY
        ])->get($this->API_BASE_URL . $this->CURRENT_PRICE_URL, [
            'name' => 'Taylor',
        ]);
    }
}
