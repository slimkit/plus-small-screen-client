<?php

Route::namespace('Zhiyi\\Component\\ZhiyiPlus\\PlusComponentH5\\Controllers')
    ->prefix('/h5')
    // ->middleware('h5')
    ->group(function () {
        Route::get('/{route?}', 'HomeController@index')
        	->where('route', '.*')
            ->name('H5');
    });