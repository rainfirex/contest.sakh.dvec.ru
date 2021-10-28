<?php

namespace App\Http\Controllers;

use App\Models\Answer as Ans;
use App\Models\Category as CatQuestion;
use App\Models\ResultMainTest;
use Illuminate\Http\Request;

class MainTest extends Controller
{
    /**
     * Получить тест
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(){
        $categories = CatQuestion::where('is_enabled', true)->orderBy('title', 'ASC')->get();
        $categories->load(['questions' => function($query){
            $query->inRandomOrder();
        }]);
        foreach ($categories as $category){
            foreach ($category->questions as $question){
                $answers = Ans::where('question_id', $question->id )->inRandomOrder()->get();
                $question['answer'] = $answers;
            }
        }
        return response()->json(compact('categories'));
    }
    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) {
        $userId      = $request->input('user_id');
        $category_id = $request->input('category_id');
        $jsonTest    = $request->input('jsonTest');
        $result      = $request->input('result');

        $result = ResultMainTest::create([
            'user_id'     => $userId,
            'category_id' => $category_id,
            'jsonTest'    => $jsonTest,
            'result'      => $result
        ]);

        return response()->json([
            'success' => !empty($result),
            'testId' => $result->id
        ]);
    }
    /**
     * Получить результат
     * @param int $testId
     * @return \Illuminate\Http\JsonResponse
     */
    public function result(int $testId ){
        $testResult = ResultMainTest::find($testId);
        return response()->json(compact('testResult'));
    }
}
