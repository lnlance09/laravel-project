<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMoreColumnsToWalletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->string('mnemonic_seed')->after('address')->nullable()->default(null);
            $table->string('passphrase')->after('mnemonic_seed')->nullable()->default(null);
            $table->string('password')->after('passphrase')->nullable()->default(null);
            $table->string('type')->after('public_key')->default('ETH');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropColumn('mnemonic_seed');
            $table->dropColumn('passphrase');
            $table->dropColumn('password');
            $table->dropColumn('type');
        });
    }
}
