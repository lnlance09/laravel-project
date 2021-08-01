<?php

namespace App\Http\Controllers;

use App\Events\PredictionCreated;
use App\Http\Controllers\CoinController;
use App\Http\Resources\Prediction as PredictionResource;
use App\Http\Resources\PredictionCollection;
use App\Models\Coin;
use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
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
        $userId = $request->input('userId', null);
        $coinId = $request->input('coinId', null);
        $status = $request->input('status', null);
        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'desc');

        $where = [];
        if ($coinId) {
            $where['coin_id'] = $coinId;
        }

        if ($status) {
            $where['status'] = $status;
        }

        if ($userId) {
            $where['user_id'] = $userId;
        }

        $predictions = Prediction::with('coin')
            ->where($where)
            ->orderBy($sort, $dir)
            ->paginate(15);
        return new PredictionCollection($predictions);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return PredictionResource
     * @param  \Illuminate\Http\Request  $request
     */
    public function create(Request $request)
    {
        $request->validate([
            'coin' => 'bail|required|exists:coins,id',
            'predictionPrice' => 'bail|required|gt:0',
            'targetDate' => 'bail|required|date|after:today',
        ]);

        $coinId = $request->input('coin');
        $explanation = $request->input('explanation');
        $predictionPrice = $request->input('predictionPrice');
        $targetDate = $request->input('targetDate');
        $user = $request->user();

        $coin = Coin::find($coinId);
        $coinController = new CoinController();
        $coin = $coinController->setLatestCoinInfo($coin);
        $currentPrice = $coin->last_price;
        $priceDiff = $predictionPrice - $currentPrice;

        $prediction = Prediction::create([
            'coin_id' => $coinId,
            'current_price' => $currentPrice,
            'explanation' => $explanation,
            'margin' => 0,
            'prediction_price' => $predictionPrice,
            'target_date' => $targetDate,
            'user_id' => $user->id
        ]);
        $prediction->refresh();

        PredictionCreated::dispatch(new PredictionResource($prediction));

        return new PredictionResource($prediction);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Prediction  $prediction
     * @return \Illuminate\Http\Response
     */
    public function destroy(Prediction $prediction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Prediction  $prediction
     * @return \Illuminate\Http\Response
     */
    public function edit(Prediction $prediction)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $username
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $prediction = Prediction::where('id', $id)
            ->with(['user'])
            ->first();

        if (empty($prediction)) {
            return response([
                'message' => 'That prediction does not exist'
            ], 404);
        }

        return new PredictionResource($prediction);
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
     * @param  \App\Models\Prediction  $prediction
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Prediction $prediction)
    {
        //
    }
}
