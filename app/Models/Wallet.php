<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use kornrunner\Ethereum\Address;

class Wallet extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'address',
        'mnemonic_seed',
        'passphrase',
        'password',
        'primary',
        'private_key',
        'public_key',
        'type',
        'user_id'
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

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public static function createNew()
    {
        $wallet = new Address();
        return [
            'address' => '0x' . $wallet->get(),
            'privateKey' => $wallet->getPrivateKey(),
            'publicKey' => $wallet->getPublicKey()
        ];
    }
}
