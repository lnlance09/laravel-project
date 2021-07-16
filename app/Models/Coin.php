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
        'last_price',
        'logo',
        'market_cap',
        'max_supply',
        'name',
        'percent_change_24h',
        'percent_change_7d',
        'percent_change_30d',
        'percent_change_60d',
        'percent_change_90d',
        'slug',
        'symbol',
        'total_supply',
        'volume_24h'
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
