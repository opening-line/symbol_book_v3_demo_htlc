# Symbolブロックチェーンによるアトミックスワップのサンプルアプリケーション

SymbolとHardhatでアトミックスワップを行うデモです。

## 動かし方

前提：Node.jsがインストールされていること。動作確認済みバージョンは、22.11.0です。  

`.env.sample`をコピーして、`.env`ファイルを作成する。

```bash
$ cp packages/frontend/.env.sample packages/frontend/.env
```

依存パッケージをインストール。

```bash
$ npm ci
```

アプリケーションを起動する。

```bash
$ npm run dev
```

ブラウザを開き、`http://localhost:5173/` を開く。  

## 補足

Symbol側はテストネットを、Hardhat側はローカルのノードを使います。

Hardhat側のニーモニックははデフォルトでは以下が使われます。

```
test test test test test test test test test test test junk
```
