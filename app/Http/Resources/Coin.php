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
            'logo' => $this->logo,
            'market_cap' => $this->market_cap,
            'max_supply' => $this->max_supply,
            'name' => $this->name,
            'total_supply' => $this->total_supply
        ];
    }
}
