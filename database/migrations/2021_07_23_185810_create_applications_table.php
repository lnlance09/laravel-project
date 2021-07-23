<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('cash')->default(null)->nullable();
            $table->unsignedBigInteger('coin_id');
            $table->string('email');
            $table->string('name');
            $table->string('portfolio')->default(null)->nullable();
            $table->string('time');
            $table->string('tx');
            $table->unsignedBigInteger('user_id');
            $table->string('years');
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
        Schema::dropIfExists('applications');
    }
}
