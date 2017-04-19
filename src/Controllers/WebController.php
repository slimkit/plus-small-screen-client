<?php

namespace Zhiyi\Component\ZhiyiPlus\PlusComponentWeb\Controllers;

use Zhiyi\Plus\Http\Controllers\Controller;
use function Zhiyi\PlusComponentWeb\view;

class WebController extends Controller
{
	public function index()
    {
        $data = [
            'base_url'   => url('/'),
            'api'        => url('api/v1')
        ];

        return view('index', $data);
    }
}