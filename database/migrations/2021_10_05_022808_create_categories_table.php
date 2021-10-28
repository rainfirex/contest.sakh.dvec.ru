<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->time('timer')->default('00:00:30');
            $table->boolean('is_enabled')->default(0);
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('operator_group_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('operator_group_id')->references('id')->on('operator_group_user');
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
        Schema::dropIfExists('categories');
    }
}
