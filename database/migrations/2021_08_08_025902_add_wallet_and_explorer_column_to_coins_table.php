<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddWalletAndExplorerColumnToCoinsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coins', function (Blueprint $table) {
            $table->string('explorer_link')->after('description')->nullable()->default(null);
            $table->string('explorer_name')->after('explorer_link')->nullable()->default(null);
            $table->string('wallet_link')->after('volume_24h')->nullable()->default(null);
            $table->string('wallet_name')->after('wallet_link')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('coins', function (Blueprint $table) {
            $table->dropColumn('explorer_link');
            $table->dropColumn('explorer_name');
            $table->dropColumn('wallet_link');
            $table->dropColumn('wallet_name');
        });
    }
}
