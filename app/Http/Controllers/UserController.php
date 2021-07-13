<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\UserCollection;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api')->only('verify');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $q = $request->input('q');
        $sort = $request->input('sort', 'accuracy');
        $dir = $request->input('dir', 'desc');

        $users = User::where('name', 'LIKE', '%' . $q . '%')
            ->withCount([
                'predictions',
                'incorrectPredictions',
                'correctPredictions',
                'pendingPredictions'
            ])
            ->paginate(15);

        if ($dir === 'asc') {
            $sorted = $users->getCollection()->sortBy([$sort])->values();
        } else {
            $sorted = $users->getCollection()->sortByDesc([$sort])->values();
        }

        $users->setCollection($sorted);

        return new UserCollection($users);
    }

    /**
     * Show the form for creating a new resource.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $request->validate([
            'email' => 'bail|required|email|unique:users',
            'name' => 'required|min:3|max:30|alpha',
            'password' => ['bail', 'required', Password::min(8)],
            'username' => 'bail|required|max:20|unique:users,username|alpha_dash'
        ]);

        $user = User::create([
            'api_token' => Str::random(60),
            'email' => $request->input('email'),
            'name' => $request->input('name'),
            'password' => $request->input('password'),
            'username' => $request->input('username'),
            'verification_code' => mt_rand(1000, 9999)
        ]);
        $user->refresh();

        return response()->json([
            'bearer' => $user->api_token,
            'user' => $user,
            'verify' => true
        ]);
    }

    /**
     * Login
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'bail|required|email',
            'password' => 'required',
        ]);

        $user = User::where([
            'email' => $request->input('email'),
            'password' => $request->input('password')
        ])->first();

        if (!$user) {
            return response([
                'message' => 'Incorrect password'
            ], 401);
        }

        return response()->json([
            'bearer' => $user->api_token,
            'user' => $user,
            'verify' => $user->email_verified_at === null
        ]);
    }

    /**
     * Verify
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|numeric',
        ]);

        $user = $request->user();
        if ($user->verification_code === $request->input('code')) {
            $user->email_verified_at = now();
            $user->save();
            return response()->json([
                'verify' => false
            ]);
        }

        return response([
            'message' => 'That code is incorrect'
        ], 401);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  String  $username
     * @return \Illuminate\Http\Response
     */
    public function show($username)
    {
        $user = User::where('username', $username)
            ->withCount([
                'predictions',
                'incorrectPredictions',
                'correctPredictions',
                'pendingPredictions'
            ])
            ->first();

        if (empty($user)) {
            return response([
                'message' => 'That user does not exist'
            ], 404);
        }

        return new UserResource($user);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        //
    }
}
