<?php

Route::namespace('Zhiyi\\Component\\ZhiyiPlus\\PlusComponentWeb\\Controllers')
    ->prefix('/web')
    ->middleware('web')
    ->group(function () {
        Route::get('/{route?}', 'HomeController@index')
        	->where('route', '.*')
            ->name('H5');
    });