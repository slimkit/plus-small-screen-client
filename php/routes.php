<?php

Route::namespace('Zhiyi\\Component\\ZhiyiPlus\\PlusComponentH5\\Controllers')
    ->prefix('/web')
    // ->middleware('h5')
    ->group(function () {
        Route::get('/{route?}', 'HomeController@index')
        	->where('route', '.*')
            ->name('H5');
    });