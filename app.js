/**
 * TermApp Class
 * 言語学習アプリのメインロジック (プログラミング用語専用版)
 */
class TermApp {
    constructor() {
        this.terms = [];
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
        this.updateStatsDisplay();
    }

    loadData() {
        const savedStats = localStorage.getItem('term-master-progress');
        if (savedStats) {
            try {
                this.userStats = JSON.parse(savedStats);
            } catch (e) {
                this.userStats = {};
            }
        }

        // data.js で定義された global の programmingTerms を使用
        if (typeof programmingTerms !== 'undefined') {
            this.terms = programmingTerms;
        } else {
            console.error("programmingTerms is not defined in data.js");
            // バックアップ
            this.terms = [{ id: "error", term: "Data Load Error", reading: "エラー", definition: "data.jsが正しく読み込まれていません。", category: "System" }];
        }

        this.terms.forEach(term => {
            if (!this.userStats[term.id]) {
                this.userStats[term.id] = { status: null, lastSeen: 0 };
            }
        });
    }

    saveData() {
        localStorage.setItem('term-master-progress', JSON.stringify(this.userStats));
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        let learned = 0;
        let ongoing = 0;
        let unseen = 0;

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
                this.startTest(isNaN(count) ? 300 : count);
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
    startTest(count) {
        let pool = [];
        if (count === 10) {
            pool = this.terms.filter(t => [3, 4].includes(this.userStats[t.id].status));
        } else if (count === 50) {
            pool = this.terms.filter(t => [2, 3, 4].includes(this.userStats[t.id].status));
        } else {
            pool = [...this.terms];
        }

        this.testQueue = pool.sort(() => Math.random() - 0.5);
        if (this.testQueue.length > count) {
            this.testQueue = this.testQueue.slice(0, count);
        }

        if (this.testQueue.length === 0) {
            alert("テスト対象の用語がありません。まずは学習モードで進めてください。");
            return;
        }

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
