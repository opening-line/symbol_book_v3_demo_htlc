# CustomHTLC

SymbolとHardhatでアトミックスワップを行うデモです。

## 動かし方

```bash
# 環境変数の設定
cp packages/frontend/.env.sample packages/frontend/.env
# 依存関係をインストール
npm ci
# 動かす
npm run dev
```

Symbol側はテストネットを、Hardhat側はローカルのノードを使います。

Hardhat側のニーモニックははデフォルトでは以下が使われます。

```
test test test test test test test test test test test test junk
```
