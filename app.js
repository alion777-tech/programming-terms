import defaultTerms from './data.js';

class TermApp {
    constructor() {
        this.terms = [];
        this.userStats = {}; // { id: { status: 1-4, lastSeen: timestamp } }
        this.currentScreen = 'home-screen';
        this.currentTerm = null;
        this.testQueue = [];
        this.testResults = { correct: 0, incorrect: 0, total: 0 };
        this.currentIndex = 0;

        this.init();
    }

    async init() {
        this.loadData();
        this.bindEvents();
        this.updateStatsDisplay();
    }

    loadData() {
        // Load stats from localStorage
        const savedStats = localStorage.getItem('term-master-progress');
        if (savedStats) {
            this.userStats = JSON.parse(savedStats);
        }

        // Initialize terms with default data
        this.terms = defaultTerms;

        // Ensure all terms have a default status if not present
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

        document.getElementById('stat-learned').textContent = learned;
        document.getElementById('stat-ongoing').textContent = ongoing;
        document.getElementById('stat-unseen').textContent = unseen;
    }

    bindEvents() {
        // Home Navigation
        document.getElementById('btn-learning-mode').onclick = () => this.startLearning();
        document.getElementById('btn-test-mode-select').onclick = () => this.switchScreen('test-select-screen');

        // Back Buttons
        document.getElementById('btn-back-to-home').onclick = () => this.switchScreen('home-screen');
        document.getElementById('btn-back-to-home-test').onclick = () => this.switchScreen('home-screen');
        document.getElementById('btn-back-home-result').onclick = () => this.switchScreen('home-screen');

        // Learning Mode Actions
        document.getElementById('main-card').onclick = (e) => {
            if (!e.target.classList.contains('btn-status')) {
                document.getElementById('main-card').classList.toggle('flipped');
            }
        };

        document.querySelectorAll('.btn-status').forEach(btn => {
            btn.onclick = (e) => {
                const status = parseInt(e.target.dataset.status);
                this.updateTermStatus(this.currentTerm.id, status);
                this.nextLearningTerm();
            };
        });

        // Test Mode Selection
        document.querySelectorAll('.test-opt').forEach(btn => {
            btn.onclick = () => {
                const count = btn.dataset.count === '100' ? 100 : parseInt(btn.dataset.count);
                this.startTest(count);
            };
        });

        // Test Quiz Actions
        document.getElementById('btn-show-test-answer').onclick = () => {
            document.getElementById('test-answer-area').classList.remove('hidden');
            document.getElementById('btn-show-test-answer').classList.add('hidden');
        };

        document.getElementById('btn-correct').onclick = () => this.processTestAnswer(true);
        document.getElementById('btn-incorrect').onclick = () => this.processTestAnswer(false);
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    // --- Learning Mode Logic ---
    startLearning() {
        this.switchScreen('learning-screen');
        this.nextLearningTerm();
    }

    nextLearningTerm() {
        // Selection Logic:
        // 1. Status 4 (Difficult) - High Priority
        // 2. Status 3 (Understood) - Medium Priority
        // 3. Status null (Unseen) - Normal
        // 4. Status 2 (Learned) - Only if 3 days passed
        // 5. Status 1 (Known) - Never

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
            alert("学習できる単語がすべて完了しました！");
            this.switchScreen('home-screen');
            return;
        }

        // Weighting: Status 4 gets more weight, then 3, then others
        const weightedPool = [];
        pool.forEach(t => {
            const s = this.userStats[t.id];
            let weight = 1;
            if (s.status === 4) weight = 10;
            else if (s.status === 3) weight = 5;
            else if (s.status === null) weight = 3;

            for (let i = 0; i < weight; i++) weightedPool.push(t);
        });

        const selected = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        this.displayTerm(selected);
    }

    displayTerm(term) {
        this.currentTerm = term;
        const card = document.getElementById('main-card');
        card.classList.remove('flipped');

        // Wait for flip back animation if it was flipped
        setTimeout(() => {
            document.getElementById('card-term-front').textContent = term.term;
            document.getElementById('card-reading-front').textContent = term.reading;
            document.getElementById('card-term-back').textContent = term.term;
            document.getElementById('card-definition').textContent = term.definition;
            document.getElementById('learn-category').textContent = term.category;
        }, 300);
    }

    updateTermStatus(id, status) {
        this.userStats[id] = {
            status: status,
            lastSeen: Date.now()
        };
        this.saveData();
    }

    // --- Test Mode Logic ---
    startTest(count) {
        let pool = [];
        if (count === 10) {
            // Priority 3 & 4
            pool = this.terms.filter(t => [3, 4].includes(this.userStats[t.id].status));
        } else if (count === 50) {
            // Priority 2, 3, 4
            pool = this.terms.filter(t => [2, 3, 4].includes(this.userStats[t.id].status));
        } else {
            // All
            pool = [...this.terms];
        }

        // If pool is smaller than requested, take everything in pool
        // Shuffle
        this.testQueue = pool.sort(() => Math.random() - 0.5);
        if (count < 100) {
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
        document.getElementById('test-progress').textContent = `Question ${this.currentIndex + 1} / ${this.testQueue.length}`;
        document.getElementById('test-progress-bar').style.width = `${(this.currentIndex / this.testQueue.length) * 100}%`;

        document.getElementById('test-term').textContent = term.term;
        document.getElementById('test-reading').textContent = term.reading;
        document.getElementById('test-definition').textContent = term.definition;

        document.getElementById('test-answer-area').classList.add('hidden');
        document.getElementById('btn-show-test-answer').classList.remove('hidden');
    }

    processTestAnswer(isCorrect) {
        const term = this.testQueue[this.currentIndex];
        const stat = this.userStats[term.id];

        if (isCorrect) {
            this.testResults.correct++;
        } else {
            this.testResults.incorrect++;
            // If failed a "Known" or "Learned" term, move back to "Understood"
            if (stat.status === 1 || stat.status === 2) {
                this.updateTermStatus(term.id, 3);
            }
        }

        this.currentIndex++;
        this.showNextTestQuestion();
    }

    showResults() {
        const score = Math.round((this.testResults.correct / this.testResults.total) * 100);
        document.getElementById('final-score').textContent = score;
        document.getElementById('res-correct').textContent = this.testResults.correct;
        document.getElementById('res-incorrect').textContent = this.testResults.incorrect;

        let msg = "よく頑張りました！";
        if (score === 100) msg = "パーフェクト！素晴らしいです！";
        else if (score >= 80) msg = "合格点です！この調子で続けましょう。";
        else if (score >= 60) msg = "もう少しでマスターです。復習を頑張りましょう。";

        document.getElementById('result-message').textContent = msg;
        this.switchScreen('result-screen');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new TermApp();
});
