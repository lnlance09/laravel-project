<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Coin extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'circulatingSupply' => $this->circulating_supply,
            'cmcId' => $this->cmc_id,
            'description' => $this->description,
            'lastPrice' => (float) $this->last_price,
            'logo' => env('AWS_URL', 'https://preditc.s3.us-west-2.amazonaws.com/') . $this->logo,
            'marketCap' => $this->market_cap,
            'maxSupply' => $this->max_supply,
            'name' => $this->name,
            'percentages' => [
                '1h' => (float) $this->percent_change_1h,
                '24h' => (float) $this->percent_change_24h,
                '7d' => (float) $this->percent_change_7d,
                '30d' => (float) $this->percent_change_30d,
                '60d' => (float) $this->percent_change_60d,
                '90d' => (float) $this->percent_change_90d
            ],
            'predictionsCount' => $this->predictions_count,
            'slug' => $this->slug,
            'symbol' => $this->symbol,
            'totalSupply' => $this->total_supply,
            'volume24h' => $this->volume_24h
        ];
    }
}
