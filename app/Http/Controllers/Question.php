<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question as Que;
use Illuminate\Http\Request;

class Question extends Controller
{
    /**
     * Получить вопросы
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $questions = Que::orderBy('id', 'DESC')->get();
        return response()->json(compact('questions'));
    }

    /**
     * Получить вопрос по id
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id){
        $question = Que::find($id);
        $question->load('category');
        $answers = Answer::where('question_id', $question->id)->orderBy('id', 'DESC')->get();
        return response()->json(compact('question', 'answers'));
    }

    /**
     * Сохранить вопрос
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)    {
        $categoryId = $request->input('categoryId');
        $number = $request->input('number');
        $title = $request->input('title');
        $score = $request->input('score');

        $question = Que::create([
            'category_id' => $categoryId,
            'title' => $title,
            'score' => $score,
            'number' => $number,
        ]);

        return response()->json(compact('question'));
    }

    /**
     * Обновить вопрос
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request){
        $questionId = $request->input('id');
        $number = $request->input('number');
        $title = $request->input('title');
        $score = $request->input('score');

        $question = Que::find($questionId);
        $question->number =  $number;
        $question->title =  $title;
        $question->score =  $score;
        $result = $question->save();

        return response()->json(compact('result'));
    }

    /**
     * Удалить вопрос
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id){
        $result = false;
        $question = Que::find($id);
        if($question)
            $result = $question->delete();
        return response()->json([
            'success' => $result
        ]);
    }
}
