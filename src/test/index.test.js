const { sum, sum2, person, toggle, range } = require('./index');

describe('test index.js file', () => {
    // 성공 케이스
    it('sums 1 + 2 t equal 3', () => {
        expect(sum(1,2)).toBe(3);
    })

    // 실패 케이스
    it('sums2 1 + 2 t equal 3', () => {
        expect(sum2(1,2)).toBe(3);
    })

    // 객체 비교 케이스
    it('makes a person', () => {
        expect(person('Lee',30)).toEqual({
            name: 'Lee',
            age: 30
        });
    })

    //참/거짓 케이스
    it('returns false', () => {
        expect(toggle(true)).toBeFalsy();
        expect(toggle(false)).toBeTruthy();
    })

    it('has 2', () => {
        expect(range(1, 3)).toContain(2);
    })
});