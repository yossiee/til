<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Article;

class scrape extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:scrape';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scraping the trend articles from Qiita';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // scraping from qiita
        require_once('simple_html_dom.php');
        $url = file_get_html(config('const.BASE_URL'));
        $elements = $url->find('div[data-hyperapp-app=Trend]');
        $dom = json_decode(html_entity_decode($elements[0]->attr['data-hyperapp-props'], ENT_QUOTES));

        $trends = ['scope' => 'daily'];
        foreach ($dom->trend->edges as $edge) {
            $article = $edge->node;
            $trends['articles'][] = array(
                'article_id'  => $article->uuid,
                'title'       => $article->title,
                'author_name' => $article->author->urlName,
                'likes_count' => $article->likesCount,
                'url'         => config('const.BASE_URL')."/".$article->author->urlName."/items/".$article->uuid,
                'created_at'  => date("Y-m-d H:i:s"),
                'updated_at'  => date("Y-m-d H:i:s")
            );
        }
        // db update or create
        foreach (array_reverse($trends['articles']) as $trend) {
            $is_exist = Article::where('article_id', $trend['article_id'])->first();
            if (!is_null($is_exist)) {
                $is_exist->updated_at = $trend['updated_at'];
                $is_exist->save();
                continue;
            }
            try {
                Article::create($trend);
            } catch (Exception $e) {
                echo $e->getMessage();
                return false;
            }
        }
    }
}
