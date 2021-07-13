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
            'accuracy' => $this->accuracy,
            'bio' => empty($this->bio) ? 'Apparently, this trader prefers to keep an air of mystery about them.' : $this->bio,
            'correctPredictionsCount' => $this->correct_predictions_count,
            'createdAt' => $this->created_at,
            'email' => $this->email,
            'id' => $this->id,
            'img' => env('AWS_URL') . $this->img,
            'incorrectPredictionsCount' => $this->incorrect_predictions_count,
            'name' => $this->name,
            'pendingPredictionsCount' => $this->pending_predictions_count,
            'predictionsCount' => $this->predictions_count,
            'username' => $this->username
        ];
    }
}
