<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection as JsonResourceCollection;

class ResponseCollection extends JsonResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'data' => $this->collection
        ];
    }
}
