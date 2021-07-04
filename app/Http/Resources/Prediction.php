<?php

namespace App\Http\Resources;

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
            'coinId' => $this->coin_id,
            'createdAt' => $this->created_at,
            'price' => $this->price,
            'targetDate' => $this->target_date
        ];
    }
}
