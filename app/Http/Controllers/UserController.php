<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\UserCollection;
use App\Mail\ForgotPassword;
use App\Models\Application;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Intervention\Image\ImageManagerStatic as Image;

class UserController extends Controller
{
    const PROTECTED_USERNAMES = [
        'all',
        'about',
        'apply',
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
        'terms',
        'trader',
        'traders',
        'unfollow',
        'verify'
    ];

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
        $q = $request->input('q');
        $sort = $request->input('sort', 'accuracy');
        $dir = $request->input('dir', 'desc');

        if (!in_array($dir, ['asc', 'desc'])) {
            return response([
                'message' => 'Invalid sort direction'
            ], 422);
        }

        $users = User::where('name', 'LIKE', '%' . $q . '%')
            ->withCount([
                'predictions',
                'incorrectPredictions',
                'correctPredictions',
                'pendingPredictions'
            ]);

        if ($sort === 'accuracy') {
            $users = $users->orderByRaw('(correct_predictions_count / predictions_count - pending_predictions_count) ' . $dir);
        }

        if ($sort === 'predictions') {
            $users = $users->orderByRaw('predictions_count ' . $dir);
        }

        $users = $users->paginate(15);
        return new UserCollection($users);
    }

    public function all(Request $request)
    {
        $count = User::all()->count();
        return response([
            'count' => $count
        ]);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'coin' => 'bail|required|exists:coins,id',
            'email' => 'bail|required|email',
            'name' => 'bail|required|min:3|max:30|alpha',
            'time' => 'bail|required',
            'tx' => 'bail|required',
            'user' => 'bail|required|exists:users,id',
        ]);

        $cash = $request->input('cash');
        $coinId = $request->input('coin');
        $email = $request->input('email');
        $name = $request->input('name');
        $portfolio = $request->input('portfolio');
        $time = $request->input('time');
        $tx = $request->input('tx');
        $userId = $request->input('user');
        $years = $request->input('years');

        $application = Application::create([
            'cash' => $cash,
            'coin_id' => $coinId,
            'email' => $email,
            'name' => $name,
            'time' => $time,
            'tx' => $tx,
            'user_id' => $userId,
            'years' => $years
        ]);
        $application->refresh();
    }

    public function changeProfilePic(Request $request)
    {
        $request->validate([
            'file' => 'required|image',
        ]);

        $userId = $request->user()->id;
        $file = $request->file('file');
        $img = Image::make($file);
        $img->resize(320, 320);
        $img->save($file);

        $contents = file_get_contents($file);
        $img = 'users/' . Str::random(24) . '.jpg';
        Storage::disk('s3')->put($img, $contents);

        $user = User::find($userId);
        $user->img = $img;
        $user->save();

        $user = User::where('id', $userId)
            ->withCount([
                'predictions',
                'incorrectPredictions',
                'correctPredictions',
                'pendingPredictions'
            ])
            ->first();

        return new UserResource($user);
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
            'name' => 'bail|required|min:3|max:30|alpha',
            'password' => ['bail', 'required', Password::min(8)],
            'username' => 'bail|required|max:20|unique:users,username|alpha_dash'
        ]);

        $username = $request->input('username');
        if (in_array(strtolower($username), self::PROTECTED_USERNAMES)) {
            return response([
                'errors' => [
                    'username' => [
                        'That username is invalid'
                    ]
                ]
            ], 422);
        }

        $user = User::create([
            'api_token' => Str::random(60),
            'email' => $request->input('email'),
            'name' => $request->input('name'),
            'password' => $request->input('password'),
            'remember_token' => Str::random(10),
            'username' => $username,
            'verification_code' => mt_rand(1000, 9999)
        ]);
        $user->refresh();

        return response()->json([
            'bearer' => $user->api_token,
            'user' => new UserResource($user),
            'verify' => true
        ]);
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
     * Forgot
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function forgot(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        if ($user) {
            $rememberToken = Str::random(10);
            $user->remember_token = $rememberToken;
            $user->save();
            $user->refresh();

            Mail::to($email)->send(new ForgotPassword($user));
            return response([
                'message' => 'Success'
            ]);
        }

        return response([
            'message' => 'No user found'
        ], 401);
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
        ])
            ->withCount([
                'predictions',
                'incorrectPredictions',
                'correctPredictions',
                'pendingPredictions'
            ])
            ->first();

        if (!$user) {
            return response([
                'message' => 'Incorrect password'
            ], 401);
        }

        return response()->json([
            'bearer' => $user->api_token,
            'user' => new UserResource($user),
            'verify' => $user->email_verified_at === null
        ]);
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
}
