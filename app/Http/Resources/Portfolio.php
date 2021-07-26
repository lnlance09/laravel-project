<?php

namespace App\Http\Resources;

use App\Http\Resources\Coin as CoinResource;
use Illuminate\Http\Resources\Json\JsonResource;

class Portfolio extends JsonResource
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
            'applicationId' => $this->application_id,
            'coin' => new CoinResource($this->coin),
            'coinId' => $this->coin_id,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at
        ];
    }
}
