<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemUserOperatorGroup extends Controller
{
    /**
     * Получить группы пользователя из сводной таблицы
     * @param $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($userId){
        $user = User::find($userId);
        $user->load([
            'groups' => function($query) {
                $query->orderBy('id', 'DESC');
            }
        ]);
        $userGroups = $user->groups;
        return response()->json(compact( 'userGroups'));
    }

    public function addGroup(int $userId, int $groupId){
        $message = null;
        $userGroup = null;
        $user = null;
//        $data = DB::select('SELECT COUNT(*) FROM user_category WHERE user_id = ? AND operator_group_id = ? LIMIT 1', [$userId, $groupId])[0];
        $count = DB::table('operator_group_user')
            ->select('*')
            ->where([
                ['user_id', $userId],
                ['operator_group_id', $groupId]
            ])
        ->count();

        if($count <= 0) {
            $success = DB::insert('INSERT INTO operator_group_user (user_id, operator_group_id) VALUES(?, ?)', [$userId, $groupId]);
            if($success) $message = 'Пользователь назначен.';
            $user = User::find($userId);

            // Получить сводную модель
            $userGroup = $user->groups()->where([
                ['user_id', $userId],
                ['operator_group_id', $groupId]
            ])->first();

        }
        else
        {
            $success = false;
            $message = 'Пользователь уже находиться в группе';
        }
        return response()->json(compact('success', 'message', 'userGroup'));
    }

    public function destroyGroup(int $pivotId) {
        $success = DB::table('operator_group_user')->delete($pivotId);
        return response()->json(compact('success'));
    }
}
