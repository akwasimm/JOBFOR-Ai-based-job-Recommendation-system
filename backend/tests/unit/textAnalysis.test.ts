import { tokenize, tfidfVector, cosineSimilarity, jaccardSimilarity } from '@/utils/textAnalysis';

describe('Text Analysis Utils - Edge Cases', () => {

    describe('tokenize', () => {
        it('handles empty strings and nullish values safely', () => {
            expect(tokenize('')).toEqual([]);
            expect(tokenize('   ')).toEqual([]);
            // Tokenizer filters out stop words and short words, so 'a' is removed.
            expect(tokenize('a')).toEqual([]);
        });

        it('handles special characters and numbers', () => {
            expect(tokenize('12345! @# $% node.js c++')).toContain('node.js');
            expect(tokenize('12345! @# $% node.js c++')).toContain('c++');
        });
    });

    describe('tfidfVector & cosineSimilarity', () => {
        it('handles zero vectors without division by zero', () => {
            const v1 = new Map([['a', 0], ['b', 0], ['c', 0]]);
            const v2 = new Map([['a', 0], ['b', 0], ['c', 0]]);
            const v3 = new Map([['a', 1], ['b', 1], ['c', 1]]);
            expect(cosineSimilarity(v1, v2)).toBe(0);
            expect(cosineSimilarity(v1, v3)).toBe(0);
        });

        it('handles identical vectors', () => {
            const v = new Map([['a', 0.5], ['b', 0.5]]);
            // Due to floating point math, it might be 0.9999999
            expect(cosineSimilarity(v, v)).toBeCloseTo(1.0);
        });
    });

    describe('jaccardSimilarity', () => {
        it('handles empty sets', () => {
            const set1 = new Set<string>();
            const set2 = new Set<string>(['a']);
            expect(jaccardSimilarity(set1, set2)).toBe(0);
            expect(jaccardSimilarity(set1, set1)).toBe(0);
        });

        it('handles identical sets', () => {
            const set = new Set(['a', 'b']);
            expect(jaccardSimilarity(set, set)).toBe(1);
        });
    });
});
