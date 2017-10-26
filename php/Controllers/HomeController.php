<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentH5\Controllers;

use Zhiyi\Plus\Models\GoldType;
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
    public function index(ImServeRepsitory $repository, GoldType $goldType)
    {
        // 金币设置
        $gold = $goldType->where('status', 1)->select('name', 'unit')->first();
        // 签到开关
        $configs = config('site');

        return view('plus:h5::index', [
            'base_url'   => url('/'),
            'api' => url('api/v2'),
            'apiv1' => url('api/v1'),
            'goldName' => $gold->name ?? '金币',
            'webSocktUrl' => config('im.open') === true ? $repository->get() : '', // 如果 im 开启，则返回地址，否则返回空。
        ]);
    }
}
