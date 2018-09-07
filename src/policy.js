// @flow

const DEFAULT_EPSILON = 0.10;

export class ExploreExploitPolicy {
    epsilon: number;

    // TODO: Make epsilon change over time from 1 to 0, as described in the blog post.
    constructor(epsilon: number = DEFAULT_EPSILON) {
        this.epsilon = epsilon;
    }

    decide(): boolean {
        const p = Math.random();
        if (p < this.epsilon) {
            return true; // Explore
        }

        return false; // Exploit
    }
}
