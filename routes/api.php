<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\CoinController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/applications', [ApplicationController::class, 'index'])->middleware(['auth:api', 'verified']);
Route::post('/applications/{id}/respond', [ApplicationController::class, 'respond'])->middleware(['auth:api', 'verified']);
Route::post('/applications/{id}/update', [ApplicationController::class, 'update'])->middleware(['auth:api', 'verified']);

Route::get('/coins', [CoinController::class, 'index']);
Route::get('/coins/graph', [CoinController::class, 'graph']);
Route::get('/coins/options', [CoinController::class, 'showOptions']);
Route::get('/coins/topTraders', [CoinController::class, 'topTraders']);
Route::get('/coins/{slug}', [CoinController::class, 'show']);

Route::get('/predictions', [PredictionController::class, 'index']);
Route::post('/predictions/create', [PredictionController::class, 'create'])->middleware(['auth:api', 'verified']);
Route::get('/predictions/{id}', [PredictionController::class, 'show']);

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/all', [UserController::class, 'all']);
Route::get('/users/{username}', [UserController::class, 'show']);
Route::get('/users/{username}/followers', [UserController::class, 'followers']);
Route::post('/users/apply', [UserController::class, 'apply']);
Route::post('/users/create', [UserController::class, 'create']);
Route::post('/users/follow', [UserController::class, 'follow']);
Route::post('/users/forgot', [UserController::class, 'forgot']);
Route::post('/users/login', [UserController::class, 'login']);
Route::post('/users/profilePic', [UserController::class, 'changeProfilePic'])->middleware('verified');
Route::post('/users/unfollow', [UserController::class, 'unfollow']);
Route::post('/users/verify', [UserController::class, 'verify'])->middleware('auth:api');
