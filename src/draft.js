function oneHot(value, classes) {
    const array = new Uint32Array(classes.length); // NOTE: Typed arrays are zero-initialized.
    const index = classes.indexOf(value);
    assert(index !== -1);
    array[index] = 1;
    return array;
}

class MoveSelector {
    select(battle) {
        // `active` is an array of active mons on the field
        // In singles it's simply a one-element array
        const activeMon = battle.p1.active[0];
        const moves = activeMon.getRequestData().moves;
        const bestMove = _.maxBy(moves, (move) => this.computeQ(battle, move)); // TODO: Allow switching too
        return bestMove;
    }
    
    computeQ(battle, move) {
        const feats1 = extractBattleFeatures(battle);
        const feats2 = extractMoveFeatures(move);
        const feats = feats1.concat(feats2);

    }
    
    extractBattleFeatures(battle) {
        // TODO
    }
    
    extractMoveFeatures(move) {
        const accuracy = (move.accuracy === true) ? 0 : move.accuracy;
        const basePower = move.basePower;
        const category = oneHot(move.category, getClasses('category'));
        // TODO
        const pp = move.pp;
        const priority = oneHot(move.priority, getClasses('priority'));
        const target = oneHot(move.target, getClasses('target'));
        const type = oneHot(move.type, getClasses('type'));
        const alwaysHit = move.alwaysHit || false;
        // TODO
        const breaksProtect = move.breaksProtect || false;
        // TODO
        const defensiveCategory = oneHot((move.defensiveCategory || move.category), getClasses('defensiveCategory'));
        const forceSwitch = move.forceSwitch || false;
        const hasCustomRecoil = move.hasCustomRecoil || false;
        // TODO
        const ignoreAbility = move.ignoreAbility || false;
        const ignoreAccuracy = move.ignoreAccuracy || false;
        const ignoreDefensive = move.ignoreDefensive || false;
        const ignoreEvasion = move.ignoreEvasion || false;
        // TODO
        const ignoreNegativeOffensive = move.ignoreNegativeOffensive;
        const ignoreOffensive = move.ignoreOffensive;
        const ignorePositiveDefensive = move.ignorePositiveDefensive;
        const ignorePositiveEvasion = move.ignorePositiveEvasion;
        const isSelfHit = move.isSelfHit;
        const isFutureMove = move.isFutureMove;
        const isViable = move.isViable;
        const mindBlownRecoil = move.mindBlownRecoil;
        const multiaccuracy = move.multiaccuracy;
        // TODO
        noDamageVariance?: boolean
        noFaint?: boolean
        // TODO
        noPPBoosts?: boolean
        noSketch?: boolean
        // TODO
        sleepUsable?: boolean
        // TODO
        stallingMove?: boolean
        stealsBoosts?: boolean
        struggleRecoil?: boolean
        // TODO
        thawsTarget?: boolean
        useTargetOffensive?: boolean
        useSourceDefensive?: boolean
        // TODO
    }
}
