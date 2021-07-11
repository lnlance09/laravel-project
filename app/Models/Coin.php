<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coin extends PublicApi
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'category',
        'circulating_supply',
        'cmc_id',
        'description',
        'logo',
        'market_cap',
        'max_supply',
        'name',
        'percent_change_24h',
        'slug',
        'symbol',
        'total_supply'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [];

    public function predictions()
    {
        return $this->hasMany(Prediction::class);
    }
}
