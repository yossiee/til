# data-volume

## Usage

### gihyodocker/imagemagick

一番簡単な Data Volume を使用。以下の黒い画像を生成するコマンドを実行する。ImageMagicK のコマンドを実行するためのコンテナで処理が終わり次第停止する。

```
$ docker container run -v ${PWD}:/workspace gihyodocker/imagemagick:latest convert -size 100x100 xc:#000000 /workspace/gihyo.jpg

$ ls
gihyo.jpg readme.md
```

ホスト側で編集したファイルをコンテナに共有する。Jenkins の Docker イメージは、ホスト側で `jenkins_home` で共有され、コンテナの停止・破棄後でも残る。

```
$ docker container run -d -p 8080:8080 -v ${PWD}/jenkins/jenkins_home:/var/jenkins_home jenkins:latest
c3cf6e4e06459c04cbbc442bb064181bad5a96a917b09b162d6b0c4fbe831476
```

コンテナのデータ永続化手法として `Data Volume コンテナ` が推奨されている。

### MySQL

```
$ mkdir mysql && vim mysql/Dockerfile
```

```Dockerfile
FROM busybox

VOLUME /var/lib/mysql

CMD ["bin/true"]
```

busybox は最低限の OS の機能を備えた軽量な OS 。
ビルドして、実行。

```
$ docker image build -t example/mysql-data:latest

$ docker container run -d --name mysql-data example/mysql-data:latest
```

mysql-data の Data Volume  コンテナを MySQL コンテナにマウント。

```
$ docker container run -d --rm --name mysql \
 -e "MYSQL_ALLOW_EMPTY_PASSWORD=yes" \
 -e "MYSQL_DATABASE=volume_test" \
 -e "MYSQL_USER=example" \
 -e "MYSQL_PASSWORD=example" \
 --volumes-from mysql-data \
 mysql:5.7

$ docker container exec -it mysql mysql -u root -p volume_test
Enter password: （空で Enter ）
mysql>
```

テーブル作成、データ投入

```
mysql> Create Table user (
    -> id int PRIMARY KEY AUTO_INCREMENT,
    -> name VARCHAR(255)
    -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

mysql> INSERT INTO user (name) VALUES ('gihyo'), ('docker'), ('Solomon Hykes');
```

ここまでやって、一旦コンテナを停止して、再度コンテナを立ち上げるとデータがそのまま残っていることがわかります。

```
$ docker container stop mysql
mysql

$ docker container run -d --rm --name mysql \
 -e "MYSQL_ALLOW_EMPTY_PASSWORD=yes" \
 -e "MYSQL_DATABASE=volume_test" \
 -e "MYSQL_USER=example" \
 -e "MYSQL_PASSWORD=example" \
 --volumes-from mysql-data \
 mysql:5.7

$ docker container exec -it mysql mysql -u root -p volume_test

mysql> select * from user;
+----+---------------+
| id | name          |
+----+---------------+
|  1 | gihyo         |
|  2 | docker        |
|  3 | Solomon Hykes |
+----+---------------+
```

データをホスト側にエクスポート

```
$ docker container run -v `${PWD}`:/tmp \
 --volumes-from mysql-data \
 busybox \
 tar cvzf /tmp/mysql-backup.tar.gz /var/lib/mysql
```
