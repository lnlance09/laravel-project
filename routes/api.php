<?php

use App\Http\Controllers\CoinController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
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

// Route::middleware('token')->get('/coins', [CoinController::class, 'index']);
// Route::middleware('token')->get('/coins/{id}', [CoinController::class, 'show']);

Route::get('/coins', [CoinController::class, 'index']);
Route::get('/coins/options', [CoinController::class, 'showOptions']);
Route::get('/coins/topTraders', [CoinController::class, 'topTraders']);
Route::get('/coins/{slug}', [CoinController::class, 'show']);

Route::get('/predictions', [PredictionController::class, 'index']);
Route::post('/predictions/create', [PredictionController::class, 'create']);
Route::get('/predictions/{id}', [PredictionController::class, 'show']);

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{username}', [UserController::class, 'show']);
Route::get('/users/{username}/followers', [UserController::class, 'followers']);
Route::post('/users/create', [UserController::class, 'create']);
Route::post('/users/follow', [UserController::class, 'follow']);
Route::post('/users/login', [UserController::class, 'login']);
Route::post('/users/unfollow', [UserController::class, 'unfollow']);
Route::post('/users/verify', [UserController::class, 'verify']);
