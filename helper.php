<?php
namespace Zhiyi\PlusComponentWeb;

use function view as plus_view;
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
    $finder = app(\Illuminate\View\FileViewFinder::class, [
        'files' => app(\Illuminate\Filesystem\Filesystem::class),
        'paths' => [base_path('/views')],
    ]);
    $factory = app(\Illuminate\Contracts\View\Factory::class);
    $factory->setFinder($finder);
    if (func_num_args() === 0) {
        return $factory;
    }
    return $factory->make($view, $data, $mergeData);
}

function base_path($path = '')
{
    return dirname(__FILE__).$path;
}

