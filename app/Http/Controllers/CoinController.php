<?php

namespace App\Http\Controllers;

use App\Http\Resources\Coin as CoinResource;
use App\Http\Resources\CoinCollection;
// use App\Http\Resources\CoinOption as CoinOptionResource;
use App\Http\Resources\CoinOptionCollection;
use App\Http\Resources\UserCollection;
use App\Models\Coin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CoinController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = $request->input('q');
        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'asc');

        $coins = Coin::where('name', 'LIKE', '%' . $q . '%')
            ->withCount(['predictions'])
            ->orderBy($sort, $dir)
            ->get();
        return new CoinCollection($coins);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Coin  $coin
     * @return \Illuminate\Http\Response
     */
    public function destroy(Coin $coin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Coin  $coin
     * @return \Illuminate\Http\Response
     */
    public function edit(Coin $coin)
    {
        //
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getCoinsWithWallets(Request $request)
    {
        $coins = DB::table('coins')
            ->select('id', 'explorer_link', 'explorer_name', 'fork', 'fork_text', 'logo', 'name', 'symbol', 'wallet_link', 'wallet_name')
            ->where('has_wallet', 1)
            ->orderBy('name', 'asc')
            ->get();

        return response([
            'data' => $coins
        ]);
    }

    public function graph(Request $request)
    {
        $id = $request->input('id', 1);
        $range = $request->input('range', '1D');

        $points = Coin::getGraphData($id, $range);

        if ($points) {
            return response($points);
        }

        return response([
            'message' => 'Error fetching graph data'
        ], 422);
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $slug
     * @return CoinResource
     */
    public function show($slug)
    {
        $coin = Coin::where('slug', $slug)->first();
        if (empty($coin)) {
            return response([
                'message' => 'That coin does not exist'
            ], 404);
        }

        if (strtotime($coin->updated_at) < strtotime('-5 minutes')) {
            $this->setLatestCoinInfo($coin);
        }

        return new CoinResource($coin);
    }

    /**
     * 
     *
     * @param  Object  $coin
     * @return \App\Models\Coin $info
     */
    public function setLatestCoinInfo($coin)
    {
        $info = Coin::getExtendedInfo($coin->cmc_id);

        if ($info) {
            $quote = current($info['quote']);
            $coin->circulating_supply = $info['circulating_supply'];
            $coin->last_price = $quote['price'];
            $coin->market_cap = $quote['market_cap'];
            $coin->max_supply = $info['max_supply'];
            $coin->percent_change_1h = $quote['percent_change_1h'];
            $coin->percent_change_24h = $quote['percent_change_24h'];
            $coin->percent_change_7d = $quote['percent_change_7d'];
            $coin->percent_change_30d = $quote['percent_change_30d'];
            $coin->percent_change_60d = $quote['percent_change_60d'];
            $coin->percent_change_90d = $quote['percent_change_90d'];
            $coin->total_supply = $info['total_supply'];
            $coin->volume_24h = $quote['volume_24h'];
            $coin->save();
            $coin->refresh();
        }

        return $coin;
    }

    public function showOptions(Request $request)
    {
        $coins = Coin::withCount(['predictions'])
            ->orderBy('predictions_count', 'desc')
            ->get();
        return new CoinOptionCollection($coins);
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
     * 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function topTraders(Request $request)
    {
        $coinId = $request->input('coinId');

        $users = User::withCount([
            'predictions' => function ($query) use ($coinId) {
                $query->where('coin_id', $coinId);
            },
            'incorrectPredictions' => function ($query) use ($coinId) {
                $query->where('coin_id', $coinId);
            },
            'correctPredictions' => function ($query) use ($coinId) {
                $query->where('coin_id', $coinId);
            },
            'pendingPredictions' => function ($query) use ($coinId) {
                $query->where('coin_id', $coinId);
            }
        ])
            ->whereHas('predictions', function ($query) use ($coinId) {
                $query->where('coin_id', $coinId)->where('status', 'Correct');
            })
            ->where('gender', 'female')
            ->orderByRaw('(correct_predictions_count / predictions_count - pending_predictions_count) desc')
            ->limit(12)
            ->get();
        return new UserCollection($users);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Coin  $coin
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Coin $coin)
    {
        //
    }
}
