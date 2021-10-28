<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'timer', 'is_enabled', 'user_id', 'operator_group_id'];

    public function questions(){
        return $this->hasMany(Question::class, 'category_id');
    }

    public function author(){
        return $this->belongsTo(User::class, 'user_id','id');
    }

    public function operatorGroup(){
        return $this->belongsTo(OperatorGroup::class, 'operator_group_id', 'id');
    }
}
