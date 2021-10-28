<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function __construct()
    {
        // Устанавливаем память и время выполнение скрипта.
        // Уст. часовой пояс.
        {
            date_default_timezone_set("Asia/Sakhalin");
            set_time_limit(1000);
            ini_set('memory_limit', '-1');
        }
    }
}
