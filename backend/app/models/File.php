<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'path', 'size', 'mime_type', 'discussion_id', 'message_id', 'user_id',
    ];

    /**
     * Get the user who uploaded the file.
     */
    public function user()
    {
        return $this->belongsTo(user::class);
    }

    /**
     * Get the discussion where the file was uploaded.
     */
    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }

    /**
     * Get the message where the file was uploaded.
     */
    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
