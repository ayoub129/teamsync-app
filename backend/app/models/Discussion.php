<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discussion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'content', 'group_id', 'channel_id', 'user_id', 'solved'
    ];

    /**
     * Get the group where the discussion belongs.
     */
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get the channel where the discussion belongs.
     */
    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }

    /**
     * Get the files associated with the discussion.
     */
    public function files()
    {
        return $this->hasMany(File::class);
    }

    /**
     * Get the comments.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function user()
    {
        return $this->belongsTo(Users::class);
    }

}
