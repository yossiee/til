# npm

## npm ( node package manager) とは
- Node.js のパッケージを管理するもの。
- package.json というファイルで依存関係のパッケージを一括でインストールしたり、できる。

## チートシート

```sh
# パッケージのインストール
$ npm install <package-name>

# インストール済のパッケージの確認
$ npm list -g

# package.json の生成、npm 管理の宣言
$ cd ~/project
$ npm init

# npmjs のユーザ情報を登録、ログイン
$ npm adduser
Username: xxx
Password: yyyyzzzz
Email: (this IS public) hoge@fuag.com

# パッケージを公開する。
$ npm publish

# 公開したパッケージを削除する
$ npm unpublish --force <package-name>
```
