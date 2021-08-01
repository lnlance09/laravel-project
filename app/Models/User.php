<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    const PROTECTED_USERNAMES = [
        'about',
        'all',
        'applications',
        'apply',
        'changePassword',
        'checkUsername',
        'coin',
        'coins',
        'contact',
        'create',
        'follow',
        'forgot',
        'login',
        'options',
        'prediction',
        'predictions',
        'privacy',
        'profilePic',
        'rules',
        'settings',
        'sitemap',
        'terms',
        'trader',
        'traders',
        'unfollow',
        'update',
        'verify',
        'wallet',
        'wallets'
    ];

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
        'email_verified_at',
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
        'email_verified_at',
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

    public function predictionsLastTwoDays()
    {
        $ago = Carbon::now()->subDays(2)->format('Y-m-d h:i:s');
        return $this->hasMany(Prediction::class)->where('created_at', '>=', $ago);
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

    public function wallets()
    {
        return $this->hasMany(Wallet::class)->orderBy('primary', 'desc');
    }

    public function primaryWallet()
    {
        return $this->hasMany(Wallet::class)->where('primary', 1);
    }
}
