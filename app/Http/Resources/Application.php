<?php

namespace App\Http\Resources;

use App\Http\Resources\Coin as CoinResource;
use App\Http\Resources\User as UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class Application extends JsonResource
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
            'time' => $this->time,
            'user' => new UserResource($this->user)
        ];
    }
}
