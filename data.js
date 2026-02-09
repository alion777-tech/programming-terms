// データの定義（グローバル変数として定義し、ESモジュール非対応環境でも動くようにします）
const termCategories = {
    "プログラミング用語": [
        { id: "pg1", term: "Variable", reading: "変数（へんすう）", definition: "値を一時的に保存するための名前付きの箱。" },
        { id: "pg2", term: "Function", reading: "関数（かんすう）", definition: "特定の処理をひとまとめにして名前をつけたもの。" },
        { id: "pg3", term: "Class", reading: "クラス", definition: "オブジェクトを作るための設計図。" },
        { id: "pg4", term: "Argument", reading: "引数（ひきすう）", definition: "関数を呼び出す際に渡す値。" },
        { id: "pg5", term: "Return Value", reading: "戻り値（もどりち）", definition: "関数が処理を終えた後に返す値。" },
        { id: "pg6", term: "Loop", reading: "ループ", definition: "条件を満たすまで処理を繰り返す手法。" },
        { id: "pg7", term: "Conditional Branch", reading: "条件分岐（じょうけんぶんき）", definition: "if文など、条件によって処理を分けること。" },
        { id: "pg8", term: "Debug", reading: "デバッグ", definition: "プログラムのバグを見つけて修正する作業。" },
        { id: "pg9", term: "Array", reading: "配列（はいれつ）", definition: "複数のデータを順番に並べて管理するデータ構造。" },
        { id: "pg10", term: "Scope", reading: "スコープ", definition: "変数や関数が有効な範囲。" }
    ],
    "webデザイン用語": [
        { id: "wd1", term: "Responsive Design", reading: "レスポンシブデザイン", definition: "画面サイズに合わせてレイアウトを変える設計手法。" },
        { id: "wd2", term: "Viewport", reading: "ビューポート", definition: "ブラウザ上で表示される領域。" },
        { id: "wd3", term: "Hex Code", reading: "ヘックスコード", definition: "16進数で表される色の指定（#FFFFFF等）。" },
        { id: "wd4", term: "UI/UX", reading: "ユーアイ・ユーエックス", definition: "使い勝手(UI)と、それによって得られる体験(UX)。" },
        { id: "wd5", term: "Grid Layout", reading: "グリッドレイアウト", definition: "格子状に要素を配置する手法。" },
        { id: "wd6", term: "Flexbox", reading: "フレックスボックス", definition: "要素を自在に並べるレイアウト方式。" },
        { id: "wd7", term: "Media Query", reading: "メディアクエリ", definition: "画面幅などの条件でCSSを切り替える機能。" },
        { id: "wd8", term: "Favicon", reading: "ファビコン", definition: "ブラウザのタブに表示される小さなアイコン。" },
        { id: "wd9", term: "Wireframe", reading: "ワイヤーフレーム", definition: "ページのレイアウトを簡略化した設計図。" },
        { id: "wd10", term: "Contrast Ratio", reading: "コントラスト比", definition: "文字と背景の明瞭さの違い。" }
    ],
    "略語": [
        { id: "ab1", term: "API", reading: "エーピーアイ", definition: "Application Programming Interface。機能の受け渡し口。" },
        { id: "ab2", term: "HTTP", reading: "エイチティーティーピー", definition: "ウェブのデータ転送用プロトコル。" },
        { id: "ab3", term: "IDE", reading: "アイディーイー", definition: "統合開発環境。プログラミングの手助けをするソフト。" },
        { id: "ab4", term: "JSON", reading: "ジェイソン", definition: "軽量なデータ交換フォーマット。" },
        { id: "ab5", term: "CRUD", reading: "クラッド", definition: "データ作成、取得、更新、削除の4基本機能。" },
        { id: "ab6", term: "DNS", reading: "ディーエヌエス", definition: "名前とアドレスを変換するシステム。" },
        { id: "ab7", term: "SQL", reading: "エスキューエル", definition: "データベース操作用の言語。" },
        { id: "ab8", term: "MVC", reading: "エムブイシー", definition: "Model-View-Controller。プログラムの役割分担の設計思想。" },
        { id: "ab9", term: "SDK", reading: "エスディーケー", definition: "開発に必要なツールを集めたパッケージ。" },
        { id: "ab10", term: "CLI", reading: "シーエルアイ", definition: "文字を入力して命令する操作画面。" }
    ],
    "パソコン用語": [
        { id: "pc1", term: "CPU", reading: "シーピーユー", definition: "PCの計算処理を担う中央処理装置。" },
        { id: "pc2", term: "RAM", reading: "ラム", definition: "データを一時的に置くためのメモリ。" },
        { id: "pc3", term: "SSD", reading: "エスエスディー", definition: "高速なファイル保存用ドライブ。" },
        { id: "pc4", term: "OS", reading: "オーエス", definition: "Windowsなどの基本ソフトウェア。" },
        { id: "pc5", term: "Bios", reading: "バイオス", definition: "電源起動時に最初にはたらくハードウェア制御プログラム。" },
        { id: "pc6", term: "GPU", reading: "ジーピーユー", definition: "画像処理に特化した計算機。" },
        { id: "pc7", term: "Ethernet", reading: "イーサネット", definition: "有線LANの接続規格。" },
        { id: "pc8", term: "Driver", reading: "ドライバ", definition: "PC周辺機器を動かすためのソフトウェア。" },
        { id: "pc9", term: "Partition", reading: "パーティション", definition: "ストレージを論理的に分けた領域。" },
        { id: "pc10", term: "Kernel", reading: "カーネル", definition: "システムの根幹となる、ハードとソフトの仲立ち役。" }
    ],
    "IT用語": [
        { id: "it1", term: "Compiler", reading: "コンパイラ", definition: "コードを機械語に一括変換するソフト。" },
        { id: "it2", term: "Algorithm", reading: "アルゴリズム", definition: "計算の手順や解法。" },
        { id: "it3", term: "Database", reading: "データベース", definition: "データの集合体とそれを管理する仕組み。" },
        { id: "it4", term: "Framework", reading: "フレームワーク", definition: "開発の土台となる枠組み。" },
        { id: "it5", term: "Server", reading: "サーバ", definition: "サービスやデータを提供する側のコンピュータ。" },
        { id: "it6", term: "Protocol", reading: "プロトコル", definition: "通信するときのルール、約束事。" },
        { id: "it7", term: "Encryption", reading: "暗号化", definition: "第3者にバレないようにデータを加工すること。" },
        { id: "it8", term: "Git", reading: "ギット", definition: "プログラムの変更履歴を管理するツール。" },
        { id: "it9", term: "Backend", reading: "バックエンド", definition: "サーバ側などの表に見えない処理部分。" },
        { id: "it10", term: "Frontend", reading: "フロントエンド", definition: "ユーザーが直接触れる画面側。" }
    ],
    "最新IT用語": [
        { id: "lt1", term: "LLM", reading: "エルエルエム", definition: "大規模言語モデル。AIの脳ミソのようなもの。" },
        { id: "lt2", term: "RAG", reading: "ラグ", definition: "検索を組み合わせたAIの回答生成技術。" },
        { id: "lt3", term: "Stable Diffusion", reading: "ステーブルディフュージョン", definition: "画像生成AIの一種。" },
        { id: "lt4", term: "Web3", reading: "ウェブスリー", definition: "ブロックチェーンを用いた分散型インターネット。" },
        { id: "lt5", term: "Blockchain", reading: "ブロックチェーン", definition: "改ざんが困難な台帳管理技術。" },
        { id: "lt6", term: "Metaverse", reading: "メタバース", definition: "コンピュータの中に作られた仮想空間の総称。" },
        { id: "lt7", term: "Digital Twin", reading: "デジタルツイン", definition: "現実と同じ姿を仮想空間に再現する技術。" },
        { id: "lt8", term: "Zero Trust", reading: "ゼロトラスト", definition: "「すべて疑う」ことを前提にしたセキュリティ。" },
        { id: "lt9", term: "Quantum Computing", reading: "量子コンピュータ", definition: "量子力学を用いた超高速コンピュータ。" },
        { id: "lt10", term: "Microservices", reading: "マイクロサービス", definition: "機能を細かく分けて開発・運用する手法。" }
    ]
};
