<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Registered Team Scopes
    |--------------------------------------------------------------------------
    |
    | Daftarkan semua model yang mendukung team scoping di sini.
    | Saat membuat model baru yang menggunakan BelongsToTeam trait,
    | tambahkan entry baru di array 'scopes' ini.
    |
    | Key: identifier scope (digunakan di database & trait).
    | label: nama tampilan di UI.
    | model: FQCN model (untuk referensi/documentation).
    |
    */
    'scopes' => [
        // Contoh:
        // 'post' => [
        //     'label' => 'Posts',
        //     'model' => App\Models\Post::class,
        // ],
        // 'comment' => [
        //     'label' => 'Comments',
        //     'model' => App\Models\Comment::class,
        // ],
    ],

];
