<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
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
            'bio' => $this->bio,
            'createdAt' => $this->created_at,
            'email' => $this->email,
            'firstName' => $this->first_name,
            'img' => $this->img,
            'lastName' => $this->last_name,
            // 'password' => $this->password,
            'username' => $this->username
        ];
    }
}
