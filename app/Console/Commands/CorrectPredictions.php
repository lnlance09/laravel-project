<?php

namespace App\Console\Commands;

use App\Models\Coin;
use App\Models\Prediction;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CorrectPredictions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'predictions:correct';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update all predictions that are set to expire on a given day';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $now = Carbon::now();
        $predictions = Prediction::whereBetween('target_date', [$now, $now->addHours(1)])->get();
        Log::alert($predictions);
    }
}
