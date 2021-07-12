<?php

namespace App\Http\Resources;

use App\Http\Resources\Coin as CoinResource;
use Illuminate\Http\Resources\Json\JsonResource;

class Prediction extends JsonResource
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
            'coin' => new CoinResource($this->coin),
            'createdAt' => $this->created_at,
            'currentPrice' => $this->current_price,
            'margin' => $this->margin,
            'predictionPrice' => $this->prediction_price,
            'status' => $this->status,
            'targetDate' => $this->target_date
        ];
    }
}
