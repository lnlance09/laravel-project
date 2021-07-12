<?php

namespace App\Http\Controllers;

use App\Http\Resources\Prediction as PredictionResource;
use App\Http\Resources\PredictionCollection;
use App\Models\Prediction;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $coinId = $request->input('coinId', null);
        $status = $request->input('status', null);
        $sort = $request->input('sort', 'id');
        $dir = $request->input('dir', 'asc');

        $where = [];
        if ($coinId) {
            $where['coin_id'] = $coinId;
        }

        if ($status) {
            $where['status'] = $status;
        }

        $predictions = Prediction::with('coin')
            ->where($where)
            ->orderBy($sort, $dir)
            ->get();
        return new PredictionCollection($predictions);
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
        return new PredictionResource(Prediction::find($id));
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
