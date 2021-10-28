<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('operator_group_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
//            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('operator_group_id');
            $table->foreign('user_id')->references('id')->on('users');
//            $table->foreign('category_id')->references('id')->on('categories');
            $table->foreign('operator_group_id')->references('id')->on('operator_groups');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_category');
    }
}
