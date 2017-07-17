<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentH5;

class ServiceProvider extends \Illuminate\Support\ServiceProvider
{
    /**
     * Bootstrap the provider.
     *
     * @return void
     * @author Seven Du <shiweidu@outlook.com>
     */
    public function boot()
    {
        $this->registarRouter();
        $this->registarHandler();
        $this->publishes([
            dirname(__DIR__).'/dist' => $this->app->publicPath().'/zhiyi/h5',
        ], 'public');
        $this->loadViewsFrom(dirname(__DIR__).'/views', 'plus:h5');
    }

    /**
     * Regiate router.
     *
     * @return [type] [description]
     * @author Seven Du <shiweidu@outlook.com>
     */
    protected function registarRouter()
    {
        $this->loadRoutesFrom(
            __DIR__.'/routes.php'
        );
    }

    /**
     * Registar handler.
     *
     * @return void
     * @author Seven Du <shiweidu@outlook.com>
     */
    protected function registarHandler()
    {
        \Zhiyi\Plus\Support\PackageHandler::loadHandleFrom('h5', PackageHandler::class);
    }
}
