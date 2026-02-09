/**
 * TermApp Class
 * 言語学習アプリのメインロジック (プログラミング用語専用版)
 */
class TermApp {
    constructor() {
        this.allTerms = {
            programming: [],
            design: []
        };
        this.terms = [];
        this.currentCategory = 'programming';
        this.userStats = {};
        this.currentScreen = 'home-screen';
        this.currentTerm = null;
        this.testQueue = [];
        this.testResults = { correct: 0, incorrect: 0, total: 0 };
        this.currentIndex = 0;

        this.init();
    }

    init() {
        console.log("App Initializing...");
        this.loadData();
        this.bindEvents();
        this.switchCategory(this.currentCategory);
    }

    loadData() {
        // 保存された進捗を読み込み
        const savedStats = localStorage.getItem('term-master-progress');
        if (savedStats) {
            try {
                this.userStats = JSON.parse(savedStats);
            } catch (e) {
                this.userStats = {};
            }
        }

        // data.js で定義された global 変数を使用
        if (typeof programmingTerms !== 'undefined') this.allTerms.programming = programmingTerms;
        if (typeof webDesignTerms !== 'undefined') this.allTerms.design = webDesignTerms;
        if (typeof pcTerms !== 'undefined') this.allTerms.pc = pcTerms;
        if (typeof itTerms !== 'undefined') this.allTerms.it = itTerms;

        // すべての単語の統計を初期化
        const combine = [
            ...this.allTerms.programming,
            ...this.allTerms.design,
            ...this.allTerms.pc,
            ...this.allTerms.it
        ];
        combine.forEach(term => {
            if (!this.userStats[term.id]) {
                this.userStats[term.id] = { status: null, lastSeen: 0 };
            }
        });
    }

    switchCategory(categoryKey) {
        this.currentCategory = categoryKey;
        this.terms = this.allTerms[categoryKey] || [];

        // UIの更新 (タグのアクティブ状態)
        document.querySelectorAll('.tag.interactive').forEach(tag => {
            if (tag.getAttribute('data-category') === categoryKey) {
                tag.classList.add('active');
            } else {
                tag.classList.remove('active');
            }
        });

        this.updateStatsDisplay();
    }

    saveData() {
        localStorage.setItem('term-master-progress', JSON.stringify(this.userStats));
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        let learned = 0;
        let ongoing = 0;
        let unseen = 0;

        // 現在選択中のカテゴリーのみ集計
        this.terms.forEach(term => {
            const stat = this.userStats[term.id];
            if (stat.status === 1 || stat.status === 2) learned++;
            else if (stat.status === 3 || stat.status === 4) ongoing++;
            else unseen++;
        });

        const elLearned = document.getElementById('stat-learned');
        const elOngoing = document.getElementById('stat-ongoing');
        const elUnseen = document.getElementById('stat-unseen');

        if (elLearned) elLearned.textContent = learned;
        if (elOngoing) elOngoing.textContent = ongoing;
        if (elUnseen) elUnseen.textContent = unseen;
    }

    bindEvents() {
        // カテゴリー切り替え
        document.querySelectorAll('.tag.interactive').forEach(tag => {
            tag.onclick = () => {
                const cat = tag.getAttribute('data-category');
                if (cat) this.switchCategory(cat);
            };
        });

        const btnLearn = document.getElementById('btn-learning-mode');
        const btnTestSelect = document.getElementById('btn-test-mode-select');

        if (btnLearn) btnLearn.onclick = () => this.startLearning();
        if (btnTestSelect) btnTestSelect.onclick = () => this.switchScreen('test-select-screen');

        const backToHome = document.getElementById('btn-back-to-home');
        const backToHomeTest = document.getElementById('btn-back-to-home-test');
        const backToHomeResult = document.getElementById('btn-back-home-result');

        if (backToHome) backToHome.onclick = () => this.switchScreen('home-screen');
        if (backToHomeTest) backToHomeTest.onclick = () => this.switchScreen('home-screen');
        if (backToHomeResult) backToHomeResult.onclick = () => this.switchScreen('home-screen');

        const mainCard = document.getElementById('main-card');
        if (mainCard) {
            mainCard.onclick = (e) => {
                if (!e.target.closest('.btn-status')) {
                    mainCard.classList.toggle('flipped');
                }
            };
        }

        document.querySelectorAll('.btn-status').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const status = parseInt(btn.getAttribute('data-status'));
                if (this.currentTerm) {
                    this.updateTermStatus(this.currentTerm.id, status);
                    this.nextLearningTerm();
                }
            };
        });

        document.querySelectorAll('.test-opt').forEach(btn => {
            btn.onclick = () => {
                const countAttr = btn.getAttribute('data-count');
                const count = parseInt(countAttr);
                this.startTest(count);
            };
        });

        const btnShowTestAnswer = document.getElementById('btn-show-test-answer');
        if (btnShowTestAnswer) {
            btnShowTestAnswer.onclick = () => {
                const area = document.getElementById('test-answer-area');
                if (area) area.classList.remove('hidden');
                btnShowTestAnswer.classList.add('hidden');
            };
        }

        const btnCorrect = document.getElementById('btn-correct');
        const btnIncorrect = document.getElementById('btn-incorrect');

        if (btnCorrect) btnCorrect.onclick = () => this.processTestAnswer(true);
        if (btnIncorrect) btnIncorrect.onclick = () => this.processTestAnswer(false);
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');
        this.currentScreen = screenId;
    }

    // --- Learning Mode ---
    startLearning() {
        this.switchScreen('learning-screen');
        this.nextLearningTerm();
    }

    nextLearningTerm() {
        const now = Date.now();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

        let pool = this.terms.filter(t => {
            const s = this.userStats[t.id];
            if (s.status === 1) return false;
            if (s.status === 2) {
                return (now - s.lastSeen) > threeDaysMs;
            }
            return true;
        });

        if (pool.length === 0) {
            alert("すべての単語を習得しました！");
            this.switchScreen('home-screen');
            return;
        }

        const weightedPool = [];
        pool.forEach(t => {
            const s = this.userStats[t.id];
            let weight = 1;
            if (s.status === 4) weight = 10;
            else if (s.status === 3) weight = 5;
            else if (s.status === null || s.status === undefined) weight = 3;

            for (let i = 0; i < weight; i++) weightedPool.push(t);
        });

        const selected = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        this.displayTerm(selected);
    }

    displayTerm(term) {
        this.currentTerm = term;
        const card = document.getElementById('main-card');
        if (card) card.classList.remove('flipped');

        setTimeout(() => {
            const elFrontTerm = document.getElementById('card-term-front');
            const elFrontRead = document.getElementById('card-reading-front');
            const elBackTerm = document.getElementById('card-term-back');
            const elDef = document.getElementById('card-definition');
            const elCat = document.getElementById('learn-category');

            if (elFrontTerm) elFrontTerm.textContent = term.term;
            if (elFrontRead) elFrontRead.textContent = term.reading;
            if (elBackTerm) elBackTerm.textContent = term.term;
            if (elDef) elDef.textContent = term.definition;
            if (elCat) elCat.textContent = term.category;

            // Google検索リンクの更新
            const elSearch = document.getElementById('learn-google-link');
            if (elSearch) {
                let suffix = 'とは+プログラミング';
                if (this.currentCategory === 'design') suffix = 'とは+Webデザイン';
                else if (this.currentCategory === 'pc') suffix = 'とは+パソコン用語';
                else if (this.currentCategory === 'it') suffix = 'とは+IT用語';
                elSearch.href = `https://www.google.com/search?q=${encodeURIComponent(term.term)}+${suffix}`;
            }
        }, 250);
    }

    updateTermStatus(id, status) {
        this.userStats[id] = {
            status: status,
            lastSeen: Date.now()
        };
        this.saveData();
    }

    // --- Test Mode ---
    startTest(requestedCount) {
        let pool = [];
        // カテゴリー内の全単語をプールにする
        pool = [...this.terms];

        if (pool.length === 0) {
            alert("テスト対象の用語がありません。");
            return;
        }

        // 基本のランダムキュー作成
        let queue = [];
        const shuffledPool = [...pool].sort(() => Math.random() - 0.5);

        // 指定された数に満たない場合、プールを繰り返して埋める
        while (queue.length < requestedCount) {
            const nextBatch = [...pool].sort(() => Math.random() - 0.5);
            queue = queue.concat(nextBatch);
        }

        // 指定された数で切り出す
        this.testQueue = queue.slice(0, requestedCount);

        this.testResults = { correct: 0, incorrect: 0, total: this.testQueue.length };
        this.currentIndex = 0;
        this.switchScreen('test-screen');
        this.showNextTestQuestion();
    }

    showNextTestQuestion() {
        if (this.currentIndex >= this.testQueue.length) {
            this.showResults();
            return;
        }

        const term = this.testQueue[this.currentIndex];

        const elProgText = document.getElementById('test-progress');
        const elBar = document.getElementById('test-progress-bar');
        const elTerm = document.getElementById('test-term');
        const elRead = document.getElementById('test-reading');
        const elDef = document.getElementById('test-definition');
        const btnShow = document.getElementById('btn-show-test-answer');
        const area = document.getElementById('test-answer-area');

        if (elProgText) elProgText.textContent = `Question ${this.currentIndex + 1} / ${this.testQueue.length}`;
        if (elBar) elBar.style.width = `${(this.currentIndex / this.testQueue.length) * 100}%`;

        if (elTerm) elTerm.textContent = term.term;
        if (elRead) elRead.textContent = term.reading;
        if (elDef) elDef.textContent = term.definition;

        // Google検索リンクの更新 (テストモード用)
        const elSearch = document.getElementById('test-google-link');
        if (elSearch) {
            let suffix = 'とは+プログラミング';
            if (this.currentCategory === 'design') suffix = 'とは+Webデザイン';
            else if (this.currentCategory === 'pc') suffix = 'とは+パソコン用語';
            else if (this.currentCategory === 'it') suffix = 'とは+IT用語';
            elSearch.href = `https://www.google.com/search?q=${encodeURIComponent(term.term)}+${suffix}`;
        }

        if (area) area.classList.add('hidden');
        if (btnShow) btnShow.classList.remove('hidden');
    }

    processTestAnswer(isCorrect) {
        const term = this.testQueue[this.currentIndex];
        const stat = this.userStats[term.id];

        if (isCorrect) {
            this.testResults.correct++;
        } else {
            this.testResults.incorrect++;
            if (stat.status === 1 || stat.status === 2) {
                this.updateTermStatus(term.id, 3);
            }
        }

        this.currentIndex++;
        this.showNextTestQuestion();
    }

    showResults() {
        const score = Math.round((this.testResults.correct / this.testResults.total) * 100);

        const elScore = document.getElementById('final-score');
        const elCorrect = document.getElementById('res-correct');
        const elIncorrect = document.getElementById('res-incorrect');
        const elMsg = document.getElementById('result-message');

        if (elScore) elScore.textContent = score;
        if (elCorrect) elCorrect.textContent = this.testResults.correct;
        if (elIncorrect) elIncorrect.textContent = this.testResults.incorrect;

        let msg = "素晴らしい成果です！";
        if (score === 100) msg = "満点！マスター達成です！";
        else if (score >= 80) msg = "高得点です！この調子！";

        if (elMsg) elMsg.textContent = msg;
        this.switchScreen('result-screen');
    }
}

window.onload = () => {
    window.app = new TermApp();
};
