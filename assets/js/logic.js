class SpinnerLogic {
    constructor() {
        this.scores = {};
        this.targetWins = 1;
        this.isGameOver = false;
    }

    reset(choices, targetWins) {
        this.scores = {};
        choices.forEach(choice => {
            this.scores[choice] = 0;
        });
        this.targetWins = targetWins;
        this.isGameOver = false;
    }

    recordWin(winner) {
        if (this.isGameOver) return { isGameOver: true, winner: null };

        this.scores[winner] = (this.scores[winner] || 0) + 1;

        if (this.scores[winner] >= this.targetWins) {
            this.isGameOver = true;
            return { isGameOver: true, winner: winner };
        }

        return { isGameOver: false, winner: winner };
    }
}