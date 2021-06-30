<?php

use App\Http\Controllers\CoinController;
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
Route::get('/coins/{slug}', [CoinController::class, 'show']);
