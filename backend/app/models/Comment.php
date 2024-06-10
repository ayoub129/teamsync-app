<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'discussion_id', 'content', 'parent_id'];

    /**
     * Get the user that owns the comment.
     */
    public function user()
    {
        return $this->belongsTo(user::class);
    }

    /**
     * Get the discussion that the comment belongs to.
     */
    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }

    /**
     * Get the parent comment if this is a reply.
     */
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * Get the replies for the comment.
     */
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

}
