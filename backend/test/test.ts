import { describe } from 'mocha';
import { equal } from 'assert';

describe('Test #1', () => {
    it('randomMath should return 46875', () => {
        equal(randomMath(5, 10, 15), 937.5)
    })
})

function randomMath(a: number, b: number, c: number) {
    return a*b*(c/2)*2.5
}