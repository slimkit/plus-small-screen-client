@extends('plus:h5://dist.index')

@section('head')

    <meta name="api-basename" content="{{ $api }}" >
    <meta name="gold-name" content="{{ $goldName }}" >
    <meta name="keywords" content="{{ $siteKeywords }}">
    <meta name="socket-url" content="{{ $webSocktUrl }}" >
    <meta name="description" content="{{ $siteDescription }}">
    <title>{{ config('app.name') }}</title>

@endsection
