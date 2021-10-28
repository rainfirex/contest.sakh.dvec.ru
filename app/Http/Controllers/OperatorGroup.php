<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OperatorGroup as opGroup;
class OperatorGroup extends Controller
{
    /**
     * Получить
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(){
        $operations = opGroup::orderBy('id', 'DESC')->get();
        return response()->json(compact('operations'));
    }
    /**
     * Сохранить
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request){
        $title = $request->input('title');
        $description = $request->input('description');

        $operation = opGroup::create([
            'title' => $title,
            'description' => $description
        ]);

        return response()->json(compact('operation'));
    }
    /**
     * Обновить
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id){

        $title = $request->input('title');
        $description = $request->input('description');

        $group = opGroup::find($id);
        $group->title = $title;
        $group->description = $description;
        $success = $group->save();

        return response()->json(compact('success'));
    }
    /**
     * Удалить
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id){
        $group = opGroup::find($id);
        $result = $group->delete();
        return response()->json([
            'success' => $result
        ]);
    }
}
