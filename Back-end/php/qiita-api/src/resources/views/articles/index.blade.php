@extends('layouts.app')

@section('content')
<main class="py-4">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <table class="table table-striped table-dark mt-5">
                    <tr>
                        <th>No</th>
                        <th>タイトル</th>
                        <th>いいね数</th>
                        <th>スクレイピング時間</th>
                    </tr>
                    @foreach($articles as $key => $article)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td><a href="{{ $article['url'] }}">{{$article['title']}}</a></td>
                        <td>{{ $article['likes_count'] }}</td>
                        <td>{{ $article['updated_at'] }}</td>
                    </tr>
                    @endforeach
                </table>
            </div>
        </div>
    </div>
</main>
@endsection
