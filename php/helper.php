<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentWeb;

use function mix as globalMix;

/**
 * Get the evaluated view contents for the given view.
 *
 * @param  string  $view
 * @param  array   $data
 * @param  array   $mergeData
 * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
 *
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
function view($view = null, $data = [], $mergeData = [])
{
    $finder = new \Illuminate\View\FileViewFinder(
        app(\Illuminate\Filesystem\Filesystem::class),
        [base_path('/views')]
    );
    $factory = app(\Illuminate\Contracts\View\Factory::class);
    $factory->setFinder($finder);
    if (func_num_args() === 0) {
        return $factory;
    }
    return $factory->make($view, $data, $mergeData);
}

/**
 * Get the component base path.
 *
 * @param string $path
 * @return string
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
function base_path($path = '')
{
    if (! $path) {
        return dirname(__DIR__);
    }

    return dirname(__DIR__).'/'.$path;
}

/**
 * Get the path to a versioned Mix file.
 *
 * @param string $path
 * @return \Illuminate\Support\HtmlString
 * @author Seven Du <shiweidu@outlook.com>
 */
function mix($path)
{
    return globalMix($path, component_name());
}

/**
 * Get the component name.
 *
 * @return string
 * @author Seven Du <shiweidu@outlook.com>
 */
function component_name(): string
{
    static $name;

    if (! $name) {
        $name = json_decode(
            app(\Illuminate\Filesystem\Filesystem::class)->get(base_path('composer.json'))
        )->name;
    }

    return $name;
}

