<?php

Route::namespace('Zhiyi\\Component\\ZhiyiPlus\\PlusComponentWeb\\Controllers')
    ->prefix('/web')
    ->middleware('web')
    ->group(function () {
        Route::get('/', 'HomeController@index')
            ->name('H5');
    });