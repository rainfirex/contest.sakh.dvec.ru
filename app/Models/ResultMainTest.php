<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultMainTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'category_id', 'jsonTest', 'result'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function test() {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
