<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePredictionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->decimal('actual_price', 16, 4)->nullable()->default(null);
            $table->unsignedBigInteger('coin_id');
            $table->decimal('current_price', 16, 4);
            $table->decimal('margin');
            $table->decimal('prediction_price', 16, 4);
            $table->string('status')->default('Pending');
            $table->datetime('target_date');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('coin_id')->references('id')->on('coins');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('predictions');
    }
}
