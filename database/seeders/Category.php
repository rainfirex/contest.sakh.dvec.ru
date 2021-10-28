<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Category extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert([
            ['title' => 'вопросы по ОТ МедПом ПБ ЭБ для договорников и спец 21'],
            ['title' => 'вопросы по ОТ МедПом ПБ ЭБ для инспекторов конкурс 21'],
            ['title' => 'вопросы по ОТ МедПом ПБ ЭБ контролеры конкурс 21']
        ]);
    }
}
