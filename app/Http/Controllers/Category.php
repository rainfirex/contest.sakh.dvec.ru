<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category as CatQuestion;
use Illuminate\Support\Facades\Auth;

class Category extends Controller
{
    /**
     * Получить категории
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        $user->load(['groups']);
        $userGroups = $user->groups;

        // Массив id-шников групп
        $groupIds = [];
        // Если у пользователя есть хотябы 1на группа, то выборка производиться по группам
        if(count($userGroups) > 0) {
            foreach ($userGroups as $group){
                $groupIds[] = $group->id;
            }
            // Выбор записей с id-шниками доступных групп пользователя
            $categories = CatQuestion::select('id', 'user_id', 'operator_group_id', 'title', 'timer', 'is_enabled')->whereIn('operator_group_id', $groupIds)->orderBy('title', 'ASC')->get();
            $categories->load([
                'questions' => function($query) {
                    $query->orderBy('id', 'DESC');
                },
                'author' => function($query) {
                    $query->select('id', 'department', 'name', 'title', 'last_ip');
                },
                'operatorGroup' => function ($query) {
                    $query->select('id', 'title', 'description');
                }
            ]);

        } else {
            $categories = CatQuestion::select('id', 'user_id', 'operator_group_id', 'title', 'timer', 'is_enabled')->orderBy('title', 'ASC')->get();
            $categories->load(
                [
                    'questions' => function ($query) {
                        $query->orderBy('id', 'DESC');
                    },
                    'author' => function ($query) {
                        $query->select('id', 'department', 'name', 'title', 'last_ip');
                    },
                    'operatorGroup' => function ($query) {
                        $query->select('id', 'title', 'description');
                    }
                ]
            );

            $userGroups = \App\Models\OperatorGroup::select('id', 'title', 'description')->orderBy('id', 'DESC')->get();
        }
        return response()->json(compact('categories', 'userGroups'));
    }
    /**
     * Сохранить категорию
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $title = $request->input('title');
        $timer = $request->input('timer');
        $operator_group_id = $request->input('operator_group_id');

        $is_enabled = ($request->input('is_enabled') == 'true') ? true : false;
        $category = CatQuestion::create([
            'user_id' => $user->id,
            'title' => $title,
            'timer' => $timer,
            'is_enabled' => $is_enabled,
            'operator_group_id' => $operator_group_id
        ]);
        $category->load('questions');
        return response()->json(compact('category'));
    }
    /**
     * Удалить категорию
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $result = false;
        $category = CatQuestion::find($id);
        if ($category)
            $result = $category->delete();
        return response()->json([
            'success' => $result
        ]);
    }
    /**
     * Обновить таймер категории
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $categoryId = $request->input('categoryId');
        $title = $request->input('title');
        $timer = $request->input('timer');
        $is_enabled = ($request->input('is_enabled') == 'true') ? true : false;
        $operator_group_id = $request->input('operator_group_id');

        $category = CatQuestion::find($categoryId);
        $category->title = $title;
        $category->timer = $timer;
        $category->is_enabled = $is_enabled;
        $category->operator_group_id = $operator_group_id;
        $category->save();

        return response()->json(compact('category'));
    }
}
