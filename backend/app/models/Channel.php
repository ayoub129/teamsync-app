<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'status'];

    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

    public function users()
    {
        return $this->belongsToMany(Users::class, 'channel_users')->withTimestamps();
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'channel_groups')->withTimestamps();
    }

    public function getDiscussionCountAttribute()
    {
        return $this->discussions()->count();
    }

    public function getUserCountAttribute()
    {
        return $this->users()->count();
    }

    public function getGroupCountAttribute()
    {
        return $this->groups()->count();
    }

    public function getMessageCountAttribute()
    {
        return $this->messages()->count();
    }
}
