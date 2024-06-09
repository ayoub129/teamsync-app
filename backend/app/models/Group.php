<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'user_id', 'image' 
    ];

    /**
     * Get the users who are members of the group.
     */
    public function users()
    {
        return $this->belongsToMany(Users::class);
    }

    /**
     * Get the discussions associated with the group.
     */
    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

}
