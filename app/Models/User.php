<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $accuracy = 0;

    protected $appends = [
        'accuracy',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'api_token',
        'bio',
        'name',
        'email',
        'gender',
        'img',
        'password',
        'username',
        'verification_code'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        // 'email_verified_at',
        'gender',
        'password',
        'remember_token',
        'verification_code'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime'
    ];

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function predictions()
    {
        return $this->hasMany(Prediction::class);
    }

    public function incorrectPredictions()
    {
        return $this->hasMany(Prediction::class)->where('status', '=', 'Incorrect');
    }

    public function correctPredictions()
    {
        return $this->hasMany(Prediction::class)->where('status', '=', 'Correct');
    }

    public function pendingPredictions()
    {
        return $this->hasMany(Prediction::class)->where('status', '=', 'Pending');
    }

    public function getAccuracyAttribute()
    {
        $correct = $this->correctPredictions()->count();
        $total = $this->predictions()->count() - $this->pendingPredictions()->count();
        if ($total === 0) {
            return 0;
        }

        return $this->accuracy = ($correct / $total) * 100;
    }
}
