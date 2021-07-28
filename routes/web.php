<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('sitemap', function () {
    $sitemap = App::make('sitemap');
    $sitemap->setCache('laravel.sitemap', 60);

    if (!$sitemap->isCached()) {
        // home page
        $sitemap->add(URL::to('/'), '2012-08-25T20:10:00+02:00', '1.0', 'daily');

        // predictions
        $predictions = DB::table('predictions')->orderBy('id', 'asc')->get();
        foreach ($predictions as $p) {
            $sitemap->add(URL::to('/predictions/' . $p->id), $p->updated_at, '0.9', 'daily');
        }
        $sitemap->add(URL::to('/predictions'), Carbon::now()->subMinutes(29), '0.9', 'hourly');

        // coins
        $coins = DB::table('coins')->orderBy('id', 'asc')->get();
        foreach ($coins as $c) {
            $sitemap->add(URL::to('/coins/' . $c->slug), $c->updated_at, '0.8', 'daily');
        }
        $sitemap->add(URL::to('/coins'), Carbon::now()->subDays(11), '0.8', 'weekly');

        // traders
        $users = DB::table('users')->orderBy('id', 'asc')->get();
        foreach ($users as $u) {
            $sitemap->add(URL::to('/' . $u->username), $u->updated_at, '0.7', 'daily');
        }
        $sitemap->add(URL::to('/traders'), Carbon::now()->subMinutes(48), '0.7', 'hourly');

        // filler pages
        $sitemap->add(URL::to('/contact'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/rules'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/about'), null, '0.4', 'monthly');
        $sitemap->add(URL::to('/sitemap'), null, '0.4', 'monthly');
    }

    return $sitemap->render('xml');
});
