<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Response extends JsonResource
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
            'response' => $this->response,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at
        ];
    }
}
