<?php

namespace App\Http\Controllers;

use App\Http\Resources\Application as ApplicationResource;
use App\Http\Resources\ApplicationCollection;
use App\Mail\ApplicationResponse;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ApplicationController extends Controller
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
        $justCount = $request->input('justCount', false);
        $perPage = $request->input('perPage', null);
        $responses = $request->input('responses', null);
        $unread = $request->input('unread', null);
        $userId = $request->user()->id;

        $where = [];

        if ($unread !== null) {
            $where['unread'] = $unread;
        }

        if ($userId) {
            $where['user_id'] = $userId;
        }

        $applications = Application::with(['coin', 'portfolio', 'responses', 'user'])
            ->where($where);

        if ($responses === "empty") {
            $applications = $applications->doesnthave('responses');
        }

        if ($justCount) {
            return response([
                'count' => $applications->count()
            ]);
        }

        if ($perPage) {
            $applications = $applications->orderBy('created_at', 'desc')
                ->paginate($perPage);
        } else {
            $applications = $applications->orderBy('created_at', 'desc')
                ->get();
        }

        return new ApplicationCollection($applications);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return PredictionResource
     * @param  \Illuminate\Http\Request  $request
     */
    public function create(Request $request)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\Response
     */
    public function destroy(Application $application)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\Response
     */
    public function edit(Application $application)
    {
        //
    }

    public function respond(Request $request, $id)
    {
        $request->validate([
            'response' => 'bail|required',
        ]);

        $userId = $request->user()->id;
        $response = $request->input('response');

        $app = Application::find($id);

        if (empty($app)) {
            return response([
                'message' => 'That application does not exist'
            ], 404);
        }

        if ($app->user_id != $userId) {
            return response([
                'message' => 'You do not have permission to respond'
            ], 404);
        }

        $app->responses()->create([
            'response' => $response
        ]);
        $app->refresh();

        try {
            // Mail::to($app->email)->send(new ApplicationResponse($app));
            // Mail::to('lnlance09@gmail.com')->send(new ApplicationResponse($app));
        } catch (\Exception $e) {
            return response([
                'message' => 'Error sending email'
            ], 401);
        }

        return new ApplicationResource($app);
    }

    public function sendMsg(Request $request)
    {
        $request->validate([
            'msg' => 'bail|required',
        ]);

        $msg = $request->input('msg');

        try {
            Mail::raw($msg, function ($message) {
                $message->from('noreply@preditc.com', 'Preditc');
                $message->to('lnlance09@gmail.com');
                $message->subject('Someone from Preditc has contacted you');
            });
        } catch (\Exception $e) {
            return response([
                'message' => 'Error sending email'
            ], 401);
        }

        return response([
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
        $application = Application::where('id', $id)
            ->with(['user'])
            ->first();

        if (empty($application)) {
            return response([
                'message' => 'That application does not exist'
            ], 404);
        }

        return new ApplicationResource($application);
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
        $userId = $request->user()->id;
        $unread = $request->input('unread', true);
        $application = Application::find($id);

        if (empty($application)) {
            return response([
                'message' => 'That application does not exist'
            ], 404);
        }

        if ($application->user_id != $userId) {
            return response([
                'message' => 'You do not have permission to respond'
            ], 404);
        }

        $application->unread = $unread;
        $application->save();

        return new ApplicationResource($application);
    }
}
