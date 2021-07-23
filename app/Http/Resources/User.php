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
        $correctCount = $this->correct_predictions_count;
        $incorrectCount = $this->incorrect_predictions_count;
        $pendingCount = $this->pending_predictions_count;
        $totalCount = $this->predictions_count;
        $activeCount = $totalCount - $pendingCount;

        $gender = $this->gender;
        $predictionsReserved = null;
        if ($gender === 'male') {
            $predictionsReserved = 0;
        }
        if ($gender === 'female') {
            $predictionsReserved = 1;
        }

        return [
            // 'accuracy' => $this->accuracy,
            'accuracy' => $activeCount === 0 ? 0 : ($correctCount / $activeCount) * 100,
            'bio' => empty($this->bio) ? 'Apparently, this trader prefers to keep an air of mystery about them.' : $this->bio,
            'correctPredictionsCount' => $correctCount,
            'createdAt' => $this->created_at,
            'email' => $this->email,
            'id' => $this->id,
            'img' => env('AWS_URL', 'https://preditc.s3.us-west-2.amazonaws.com/') . $this->img,
            'incorrectPredictionsCount' => $incorrectCount,
            'name' => $this->name,
            'pendingPredictionsCount' => $pendingCount,
            'predictionsCount' => $totalCount,
            'predictionsReserved' => $predictionsReserved,
            'username' => $this->username
        ];
    }
}
