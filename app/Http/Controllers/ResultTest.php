<?php

namespace App\Http\Controllers;

use App\Models\ResultMainTest;
use App\Models\User;

class ResultTest extends Controller
{
    public function users(){
//        $user = Auth::user();
//        $results = ResultMainTest::select('*')->distinct('user_id')->orderBy('id', 'DESC')->get();//->groupBy('user_id');

        // Пользователи которые проходили тестирование
        $users = ResultMainTest::distinct()->select('user_id')->get();
        $users->load([
            'user' => function($query) {
                $query->select('id', 'name', 'title', 'email', 'phone', 'last_ip');
            }
        ]);
        return response()->json(compact('users'));
    }

    public function tests(int $id){
        $user = User::find($id);
        $tests = ResultMainTest::distinct()->select('category_id')->where('user_id', $user->id)->get();

        $tests->load([
            'test' => function($query) {
                $query->select('id', 'title', 'timer', 'is_enabled', 'operator_group_id');
            }
        ]);
        return response()->json(compact('tests'));
    }

    public function result(int $userId, int $testId){
        $results = ResultMainTest::select('id', 'jsonTest', 'result', 'created_at')->where([
            ['user_id', $userId],
            ['category_id', $testId]
        ])->get();

        foreach ($results as $r){
            $r->jsonTest = json_decode($r->jsonTest);
            $r->result = json_decode($r->result);
        }

        return response()->json(compact('results'));
    }

    public function interval_tests($dateStart, $dateEnd) {
        $results = ResultMainTest::whereBetween('created_at', [$dateStart.' 00:00:00', $dateEnd.' 23:59:59'])
            ->orderBy('created_at', 'ASC')
            ->get();
        $results->load(['user' => function($query){
            $query->select('id', 'name', 'title', 'department');
        }]);

        foreach($results as $result){
            $result->jsonTest = json_decode( $result->jsonTest);
            $result->result   = json_decode( $result->result);
        }

        return response()->json(compact('results'));
    }
}
