<?php
namespace Zhiyi\Component\ZhiyiPlus\PlusComponentH5\Controllers;

use Illuminate\Http\Request;
use Zhiyi\Plus\Http\Controllers\Controller;

class AlipayController extends Controller 
{
	public function index(Request $request)
	{
		file_put_contents('alipay.txt', json_encode($request));
	}
}