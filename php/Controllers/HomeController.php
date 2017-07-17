<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentH5\Controllers;

use Zhiyi\Plus\Http\Controllers\Controller;
use Zhiyi\Component\ZhiyiPlus\PlusComponentIm\Repository\ImServe as ImServeRepsitory;

class HomeController extends Controller
{
    /**
     * The SPA entry.
     *
     * @param \Zhiyi\Component\ZhiyiPlus\PlusComponentIm\Repository\ImServe $repository
     * @return mixed
     * @author Seven Du <shiweidu@outlook.com>
     */
    public function index(ImServeRepsitory $repository)
    // public function index()
    {
        return view('plus:h5::index', [
            'base_url'   => url('/'),
            // 'api'        => url('api/v1'),
            'api' => url('api/v2'),
            'apiv1' => url('api/v1'),
            'webSocktUrl' => config('im.open') === true ? $repository->get() : '', // 如果 im 开启，则返回地址，否则返回空。
        ]);
    }
}