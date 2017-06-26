<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentWeb\Controllers;

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
    {
        return view('plus:h5::index', [
            'base_url'   => url('/'),
            'api'        => url('api/v1'),
            'webSocktUrl' => config('im.open') === true ? $repository->get() : '', // 如果 im 开启，则返回地址，否则返回空。
        ]);
    }
}