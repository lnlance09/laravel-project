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
            'dailyPercentChange' => $this->percent_change_24h,
            'description' => $this->description,
            'logo' => $this->logo,
            'marketCap' => $this->market_cap,
            'maxSupply' => $this->max_supply,
            'name' => $this->name,
            'predictionsCount' => $this->predictions_count,
            'slug' => $this->slug,
            'symbol' => $this->symbol,
            'totalSupply' => $this->total_supply,
        ];
    }
}
