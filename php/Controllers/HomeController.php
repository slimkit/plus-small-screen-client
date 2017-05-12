<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentWeb\Controllers;

use Zhiyi\Plus\Http\Controllers\Controller;
use Zhiyi\Plus\Models\CommonConfig;
use Zhiyi\Component\ZhiyiPlus\PlusComponentIm\Installer\Installer;
use function Zhiyi\Component\ZhiyiPlus\PlusComponentWeb\view;

class HomeController extends Controller
{
    public function index()
    {
    	$server = CommonConfig::byNamespace(Installer::$configNamespace)
            ->byName(Installer::$configName)
            ->first();
        $data = [
            'base_url'   => url('/'),
            'api'        => url('api/v1'),
            'webSocktUrl' => $server ? $server->value : ''
        ];

        return view('index', $data);
    }
}