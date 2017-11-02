<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentH5\Controllers;

use Zhiyi\Plus\Models\GoldType;
use Zhiyi\Plus\Models\CommonConfig;
use Zhiyi\Plus\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository;
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
    public function index(ImServeRepsitory $repository, GoldType $goldType, Repository $config, CommonConfig $common)
    {
        // 金币设置
        $gold = $goldType->where('status', 1)->select('name', 'unit')->first();
        $siteConfig = config('site');
        $siteSetting = config('app');
        $jssdkAmap = config('around-amap.amap-jssdk');

        return view('plus:h5::index', [
            'jssdkAmap' => $jssdkAmap,
            'siteName' => $siteSetting['name'],
            'siteKeywords' => $siteSetting['keywords'],
            'siteDescription' => $siteSetting['description'],
            'base_url'   => url('/'),
            'api' => url('api/v2'),
            'apiv1' => url('api/v1'),
            'goldName' => $gold->name ?? '金币',
            'webSocktUrl' => config('im.open') === true ? $repository->get() : '', // 如果 im 开启，则返回地址，否则返回空。
        ]);
    }
}
