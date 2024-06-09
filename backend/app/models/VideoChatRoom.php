<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoChatRoom extends Model
{
    use HasFactory;

    protected $fillable = ['channel_name', 'created_by'];

    public function user()
    {
        return $this->belongsTo(Users::class, 'created_by');
    }
}
