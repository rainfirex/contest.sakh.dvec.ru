<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('auth', [Controllers\AuthLdap::class, 'login']);

Route::get('auth-user', [Controllers\AuthLdap::class, 'auth_user']);

Route::put('logout', [Controllers\AuthLdap::class, 'logout']);

Route::group(['prefix' => 'main-test', 'middleware' => ['auth:api']], function(){
    Route::get('', [Controllers\MainTest::class, 'index']);
    Route::get('result/test-id/{Id}', [Controllers\MainTest::class, 'result']);
    Route::post('', [Controllers\MainTest::class, 'store']);
});

Route::group(['prefix' => 'categories', 'middleware' => ['auth:api', 'isHandler']], function (){
    Route::get('', [Controllers\Category::class, 'index']);
    Route::post('create', [Controllers\Category::class, 'store']);
    Route::put('update', [Controllers\Category::class, 'update']);
    Route::delete('remove/{id}', [Controllers\Category::class, 'destroy']);
});

Route::group(['prefix' => 'questions', 'middleware' => ['auth:api', 'isHandler']], function(){
    Route::get('', [Controllers\Question::class, 'index']);
    Route::get('get/{id}', [Controllers\Question::class, 'show']);
    Route::post('create', [Controllers\Question::class, 'store']);
    Route::put('update', [Controllers\Question::class, 'update']);
    Route::delete('remove/{id}', [Controllers\Question::class, 'destroy']);
});

Route::group(['prefix' => 'answers', 'middleware' => ['auth:api', 'isHandler']], function(){
    Route::get('', [Controllers\Answer::class, 'index']);
    Route::post('create', [Controllers\Answer::class, 'store']);
    Route::put('update', [Controllers\Answer::class, 'update']);
    Route::delete('remove/{id}', [Controllers\Answer::class, 'destroy']);
});

Route::group(['prefix' => 'users', 'middleware' => ['auth:api', 'isAdmin']], function() {
    Route::get('', [Controllers\SystemUser::class, 'index']);
    Route::put('{id}', [Controllers\SystemUser::class, 'update']);
    Route::get('{userId}/groups', [Controllers\SystemUserOperatorGroup::class, 'index'] );
    Route::post('{userId}/add-group/{groupId}', [Controllers\SystemUserOperatorGroup::class, 'addGroup'] );
    Route::delete('groups/{pivotId}', [Controllers\SystemUserOperatorGroup::class, 'destroyGroup'] );
});

Route::group(['prefix' => 'operation-group', 'middleware' => ['auth:api', 'isAdmin']], function () {
    Route::get('', [Controllers\OperatorGroup::class, 'index']);
    Route::post('create', [Controllers\OperatorGroup::class, 'store']);
    Route::delete('remove/{id}', [Controllers\OperatorGroup::class, 'destroy']);
    Route::put('{id}', [Controllers\OperatorGroup::class, 'update']);
});

Route::group(['prefix' => 'results', 'middleware' => ['auth:api', 'isHandler']], function() {
    Route::get('users', [Controllers\ResultTest::class, 'users']);
    Route::get('users/{id}/tests', [Controllers\ResultTest::class, 'tests']);
    Route::get('users/{userId}/tests/{testId}', [Controllers\ResultTest::class, 'result']);
    Route::get('interval/{dateStart}/{dateEnd}', [Controllers\ResultTest::class, 'interval_tests']);
});
