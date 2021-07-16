<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCoinPercentageChangesColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('coins', function (Blueprint $table) {
            $table->decimal('last_price', 16, 4)->after('max_supply')
                ->nullable()
                ->default(null);
            $table->decimal('percent_change_1h')->after('name')
                ->nullable()
                ->default(null);
            $table->decimal('percent_change_7d')->after('percent_change_24h')
                ->nullable()
                ->default(null);
            $table->decimal('percent_change_30d')->after('percent_change_7d')
                ->nullable()
                ->default(null);
            $table->decimal('percent_change_60d')->after('percent_change_30d')
                ->nullable()
                ->default(null);
            $table->decimal('percent_change_90d')->after('percent_change_60d')
                ->nullable()
                ->default(null);
            $table->decimal('volume_24h', 16, 4)->after('total_supply')
                ->nullable()
                ->default(null);
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
            $table->dropColumn('last_price');
            $table->dropColumn('percent_change_1h');
            $table->dropColumn('percent_change_7d');
            $table->dropColumn('percent_change_30d');
            $table->dropColumn('percent_change_60d');
            $table->dropColumn('percent_change_90d');
            $table->dropColumn('volume_24h');
        });
    }
}
