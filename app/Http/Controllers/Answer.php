<?php

namespace App\Http\Controllers;

use App\Models\Answer as Ans;
use Illuminate\Http\Request;

class Answer extends Controller
{
    public function index()
    {
        $answers = Ans::all();
        return response()->json(compact('answers'));
    }
    /**
     * Сохранить ответ
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request){
        $questionId = $request->input('questionId');
        $number = $request->input('number');
        $title = $request->input('title');
        $score = $request->input('score');

        $answer = Ans::create([
            'question_id' => $questionId,
            'number' => $number,
            'title' => $title,
            'score' => $score
        ]);

        return response()->json(compact('answer'));
    }
    /**
     * Обновить ответ
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request){
        $answerId = $request->input('id');
        $number = $request->input('number');
        $title = $request->input('title');
        $score = $request->input('score');

        $answer = Ans::find($answerId);
        $answer->title  = $title;
        $answer->number = $number;
        $answer->score  = $score;
        $result = $answer->save();

        return response()->json(compact('result'));
    }
    /**
     * Удалить ответ
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id){
        $result = false;
        $answer = Ans::find($id);
        if($answer)
            $result = $answer->delete();
        return response()->json([
            'success' => $result
        ]);
    }
}
