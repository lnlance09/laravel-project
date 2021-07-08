<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoinsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coins', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->bigInteger('circulating_supply')->nullable();
            $table->bigInteger('cmc_id')->nullable();
            $table->text('description');
            $table->string('logo');
            $table->bigInteger('market_cap');
            $table->bigInteger('max_supply')->nullable();
            $table->string('name');
            $table->decimal('percent_change_24h');
            $table->string('slug');
            $table->string('symbol');
            $table->bigInteger('total_supply')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coins');
    }
}
