// Create 2 battle bots with 2 separate NNs. The shape of their NNs should be the same.

const p1 = new BattleBot();
const p2 = new BattleBot();

// 100 epochs
for (let i = 0; i < 100; i++) {
    // 100 games per epoch
    for (let j = 0; j < 100; j++) {
        const weights = p1.train(p2);
        p1.update(weights);
    }

    p2.update(p1.weights);
}

const battle = new Battle();
p1.act(battle);
// p1.play(battle) - plays all subsequent moves?
// p1.choose(battle) - chooses the next move
