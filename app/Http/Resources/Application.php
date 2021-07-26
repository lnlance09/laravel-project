<?php

namespace App\Http\Resources;

use App\Http\Resources\Coin as CoinResource;
use App\Http\Resources\PortfolioCollection as PortfolioCollection;
use App\Http\Resources\ResponseCollection as ResponseCollection;
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
            'cash' => $this->cash,
            'coin' => new CoinResource($this->coin),
            'createdAt' => $this->created_at,
            'email' => $this->email,
            'name' => $this->name,
            'portfolio' => new PortfolioCollection($this->portfolio),
            'responses' => new ResponseCollection($this->responses),
            'time' => $this->time,
            'tx' => $this->tx,
            'unread' => $this->unread,
            'updatedAt' => $this->updated_at,
            'user' => new UserResource($this->user),
            'years' => $this->years
        ];
    }
}
