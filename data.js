const defaultTerms = [
    // webデザイン用語
    { id: "wd1", term: "Responsive Design", reading: "レスポンシブデザイン", definition: "デバイスの画面サイズに応じてレイアウトが最適化される設計手法。", category: "webデザイン用語" },
    { id: "wd2", term: "Viewport", reading: "ビューポート", definition: "ブラウザ上でウェブページが表示される領域のこと。", category: "webデザイン用語" },
    { id: "wd3", term: "Hex Code", reading: "ヘックスコード", definition: "16進数で色を指定するコード（例：#FFFFFF）。", category: "webデザイン用語" },
    { id: "wd4", term: "UI/UX", reading: "ユーアイ・ユーエックス", definition: "ユーザーインターフェース（操作感）とユーザーエクスペリエンス（体験）。", category: "webデザイン用語" },
    { id: "wd5", term: "Grid Layout", reading: "グリッドレイアウト", definition: "格子状に要素を配置するレイアウト手法。", category: "webデザイン用語" },
    { id: "wd6", term: "Serif/Sans-serif", reading: "セリフ・サンセリフ", definition: "文字の端に飾りがあるかないかの書体分類。", category: "webデザイン用語" },
    { id: "wd7", term: "Flexbox", reading: "フレックスボックス", definition: "要素を1次元（横または縦）に整列させるレイアウト手法。", category: "webデザイン用語" },
    { id: "wd8", term: "CSS Selectors", reading: "シーエスエスセレクタ", definition: "スタイルを適用するHTML要素を特定するための記述方式。", category: "webデザイン用語" },
    { id: "wd9", term: "Z-index", reading: "ゼットインデックス", definition: "要素の重なりの優先順位を指定するプロパティ。", category: "webデザイン用語" },
    { id: "wd10", term: "Accessibility", reading: "アクセシビリティ", definition: "障害の有無にかかわらず、誰もが情報にアクセスできること。", category: "webデザイン用語" },

    // 略語
    { id: "ab1", term: "API", reading: "エーピーアイ", definition: "Application Programming Interface。ソフトウェア同士が機能を共有するための仕組み。", category: "略語" },
    { id: "ab2", term: "HTTP", reading: "エイチティーティーピー", definition: "HyperText Transfer Protocol。ウェブデータをやり取りするための通信規約。", category: "略語" },
    { id: "ab3", term: "IDE", reading: "アイディーイー", definition: "Integrated Development Environment。統合開発環境。コード作成に必要なツールがまとまったソフト。", category: "略語" },
    { id: "ab4", term: "JSON", reading: "ジェイソン", definition: "JavaScript Object Notation。データ交換のための軽量なフォーマット。", category: "略語" },
    { id: "ab5", term: "CRUD", reading: "クラッド", definition: "Create, Read, Update, Delete。データ操作の基本4機能。", category: "略語" },
    { id: "ab6", term: "DNS", reading: "ディーエヌエス", definition: "Domain Name System。ドメイン名とIPアドレスを紐付ける仕組み。", category: "略語" },
    { id: "ab7", term: "SQL", reading: "エスキューエル", definition: "Structured Query Language。データベースを操作するための言語。", category: "略語" },
    { id: "ab8", term: "MVP", reading: "エムブイピー", definition: "Minimum Viable Product。実用可能な最小限の機能を持つ製品。", category: "略語" },
    { id: "ab9", term: "SaaS", reading: "サース", definition: "Software as a Service。クラウド上で利用できるソフトウェアサービス。", category: "略語" },
    { id: "ab10", term: "CLI", reading: "シーエルアイ", definition: "Command Line Interface。文字を入力して操作するインターフェース。", category: "略語" },

    // パソコン用語
    { id: "pc1", term: "CPU", reading: "シーピーユー", definition: "Central Processing Unit。PCの「頭脳」にあたる計算処理装置。", category: "パソコン用語" },
    { id: "pc2", term: "RAM", reading: "ラム", definition: "Random Access Memory。データを一時的に読み書きする作業スペース（メモリ）。", category: "パソコン用語" },
    { id: "pc3", term: "SSD", reading: "エスエスディー", definition: "Solid State Drive。高速なデータ保存装置。", category: "パソコン用語" },
    { id: "pc4", term: "OS", reading: "オーエス", definition: "Operating System。PCを動かすための基本ソフトウェア（Windows, macOSなど）。", category: "パソコン用語" },
    { id: "pc5", term: "Bios", reading: "バイオス", definition: "Basic Input/Output System。PCのハードウェア制御を行う基本プログラム。", category: "パソコン用語" },
    { id: "pc6", term: "GPU", reading: "ジーピーユー", definition: "Graphics Processing Unit。画像処理に特化した演算装置。", category: "パソコン用語" },
    { id: "pc7", term: "Motherboard", reading: "マザーボード", definition: "各種パーツを繋ぐ主要な電子回路基板。", category: "パソコン用語" },
    { id: "pc8", term: "IP Address", reading: "アイピーアドレス", definition: "ネットワーク上の端末を識別するための番号。", category: "パソコン用語" },
    { id: "pc9", term: "Kernel", reading: "カーネル", definition: "OSの中核となる、ハードウェアとソフトを橋渡しする部分。", category: "パソコン用語" },
    { id: "pc10", term: "Peripheral", reading: "周辺機器（じゅうへんきき）", definition: "マウス、キーボード、プリンタなどの外部接続機器。", category: "パソコン用語" },

    // IT用語
    { id: "it1", term: "Variable", reading: "変数（へんすう）", definition: "データを一時的に格納しておくための「箱」。", category: "IT用語" },
    { id: "it2", term: "Algorithm", reading: "アルゴリズム", definition: "問題を解決するための手順や計算方法。", category: "IT用語" },
    { id: "it3", term: "Database", reading: "データベース", definition: "大量のデータを効率よく保存、管理するための仕組み。", category: "IT用語" },
    { id: "it4", term: "Framework", reading: "フレームワーク", definition: "システム開発を効率化するための土台となるソフトウェアの枠組み。", category: "IT用語" },
    { id: "it5", term: "Compiler", reading: "コンパイラ", definition: "人間が書いたプログラムをコンピュータが理解できる形式に変換するプログラム。", category: "IT用語" },
    { id: "it6", term: "Loop", reading: "ループ（繰り返し）", definition: "特定の処理を条件が満たされるまで繰り返す制御構造。", category: "IT用語" },
    { id: "it7", term: "Function", reading: "関数（かんすう）", definition: "特定の処理をまとめて、名前をつけたもの。", category: "IT用語" },
    { id: "it8", term: "Object-oriented", reading: "オブジェクト指向（しこう）", definition: "データと機能をセットにして設計する考え方。", category: "IT用語" },
    { id: "it9", term: "Recursion", reading: "再帰（さいき）", definition: "関数の中で自分自身を呼び出す手法。", category: "IT用語" },
    { id: "it10", term: "Encryption", reading: "暗号化（あんごうか）", definition: "データを第三者に分からない形式に変換すること。", category: "IT用語" },

    // 最新IT用語
    { id: "lt1", term: "LLM", reading: "エルエルエム", definition: "Large Language Model。大規模言語モデル。大量のテキストデータを学習したAI。", category: "最新IT用語" },
    { id: "lt2", term: "RAG", reading: "ラグ", definition: "Retrieval-Augmented Generation。検索拡張生成。独自の知識をAIに追加して回答させる技術。", category: "最新IT用語" },
    { id: "lt3", term: "Generative AI", reading: "生成AI（ジェネレーティブエーアイ）", definition: "文章や画像などを新しく生成できる人工知能。", category: "最新IT用語" },
    { id: "lt4", term: "Edge Computing", reading: "エッジコンピューティング", definition: "端末に近い場所でデータを処理し、低遅延を実現する技術。", category: "最新IT用語" },
    { id: "lt5", term: "Blockchain", reading: "ブロックチェーン", definition: "分散型台帳技術。データの改ざんが困難なネットワーク構造。", category: "最新IT用語" },
    { id: "lt6", term: "Quantum Computing", reading: "量子コンピュータ", definition: "量子力学の現象を利用して超高速演算を行う技術。", category: "最新IT用語" },
    { id: "lt7", term: "NFT", reading: "エヌエフティー", definition: "Non-Fungible Token。非代替性トークン。偽造不可なデジタル鑑定書。", category: "最新IT用語" },
    { id: "lt8", term: "Zero Trust", reading: "ゼロトラスト", definition: "「何も信頼しない」ことを前提としたセキュリティの考え方。", category: "最新IT用語" },
    { id: "lt9", term: "Digital Twin", reading: "デジタルツイン", definition: "仮想空間に現実の物体をリアルタイムに再現する技術。", category: "最新IT用語" },
    { id: "lt10", term: "Metaverse", reading: "メタバース", definition: "ネットワーク上に構築された3次元の仮想社会。", category: "最新IT用語" },
];

export default defaultTerms;
