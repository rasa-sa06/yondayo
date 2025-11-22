<div align="center">
<img width="322" height="143" alt="logo" src="https://github.com/user-attachments/assets/d5f00265-4f9f-441e-8051-092605cc2571" />
</div>

# よんだよ
**親子で楽しめる読み聞かせ記録アプリ**</br>
読み聞かせで読んだ絵本を記録していくシンプルなアプリです。</br>
<img src="./public/readme/dashboard.png" width="800" alt="ダッシュボード画面">

🌐 **デモURL**　https://yondayo-steel.vercel.app/</br>
メールアドレス：</br>
パスワード：</br>



**＜ アプリの特徴 ＞**</br>
＊ 兄弟ごとに記録を取ることができます。</br>
＊ 読書記録の入力をサポートします。</br>
　 (楽天APIと連携をしているので、タイトルの入力だけで簡単に絵本の情報を取得できます。)</br>
＊ 楽天APIを使って、絵本を検索することができます。</br>
＊ 気になった本はブックマークも可能です。</br>
＊ スタンプカードで子どもの読書意欲も掻き立てます。</br>

---

## 開発背景
現在、3歳と1歳の子どもにたくさんの絵本を読み聞かせをするなかで</br>
下記のような課題を感じていました。

1. 年齢に合わせた絵本を数多ある中から選ぶのが難しい  
2. これまで読んだ本を図書館に返してしまうと忘れてしまう  
3. 子どもと一緒に楽しめるようにしたい（読書習慣の獲得）

この課題を解決するために「よんだよ」は生まれました。

---

## 主な機能
- 読書記録管理（読んだ本の数の表示。履歴検索、並び替え。楽天booksAPIによる入力サポート）
- 検索機能（楽天booksのAPIと連携。年齢、カテゴリー、作者、フリーのキーワードで検索が可能）
- 未読本の管理（検索機能の結果からボタン１つで読みたい本に登録）
- スタンプ機能（本を登録するたびに自動で反映）
- アカウント管理（ユーザー情報、メールアドレスやパスワードの変更、子どもの情報の変更や追加）
- 認証機能

※アカウント管理、認証機能以外は、子どもごとに切り替えて管理が可能

---
| Category | Technology Stack |
|----------|------------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS |
| Backend  | Supabase (PostgreSQL, Authentication, RLS) |
| External API | Rakuten Books API |
| Version Control | GitHub, Git |
| Infrastructure | Vercel |
| Design | Figma, Google Fonts, Canva |
| Code Quality | ESLint, Prettier |

---
## Figmaファイル
https://www.figma.com/design/kD0HKZz5jdbxIvEPZBxFcX/%E3%82%88%E3%82%93%E3%81%A0%E3%82%88?node-id=0-1&t=Uzq4vypSRA5cTtgf-1


---
## 🔹 将来的に追加したい機能  
- ISBNコードを利用した図書登録      
- AIを活用したおすすめ機能
