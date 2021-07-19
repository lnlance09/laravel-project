<?php

namespace App\Http\Resources;

use App\Http\Resources\Coin as CoinResource;
use App\Http\Resources\User as UserResource;
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
            'actualPrice' => $this->actual_price,
            'coin' => new CoinResource($this->coin),
            'createdAt' => $this->created_at,
            'currentPrice' => $this->current_price,
            'explanation' => $this->explanation === null ? 'No explanation given...' : $this->explanation,
            'margin' => $this->margin,
            'predictionPrice' => (float) $this->prediction_price,
            'status' => $this->status,
            'targetDate' => $this->target_date,
            'user' => new UserResource($this->user)
        ];
    }
}
