<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVideoChatRoomsTable extends Migration
{
    public function up()
    {
        Schema::create('video_chat_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('channel_name');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('video_chat_rooms');
    }
}
