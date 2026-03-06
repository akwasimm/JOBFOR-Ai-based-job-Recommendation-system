import { RecommendationService } from '../../src/services/recommendation.service';

describe('RecommendationService - Edge Cases', () => {
    let service: RecommendationService;

    beforeEach(() => {
        service = new RecommendationService();
    });

    describe('calculateExperienceMatch', () => {
        it('handles missing required levels', () => {
            // If job doesn't require a specific level, neutral 0.7 score
            expect(service.calculateExperienceMatch(5, undefined)).toBe(0.7);
        });

        it('handles extreme experience differences', () => {
            // Overqualified (e.g. 20 years for an Entry role)
            expect(service.calculateExperienceMatch(20, 'ENTRY')).toBe(0.5);

            // Underqualified (0 years for an Executive role)
            expect(service.calculateExperienceMatch(0, 'EXECUTIVE')).toBe(0);
        });

        it('handles boundary conditions for ranges', () => {
            // Min boundary for JUNIOR (1 year)
            expect(service.calculateExperienceMatch(1, 'JUNIOR')).toBe(1.0);

            // Mid range for SENIOR (7 years)
            expect(service.calculateExperienceMatch(7, 'SENIOR')).toBe(1.0);
        });
    });

    describe('calculateSkillMatch', () => {
        it('handles array edge cases', () => {
            // Empty user skills and empty job skills -> 0.5 (neutral)
            expect(service.calculateSkillMatch([], []).score).toBe(0.5);

            // Empty user skills but job has skills -> 0.0
            const res1 = service.calculateSkillMatch([], ['React', 'Node']);
            expect(res1.score).toBe(0);
            expect(res1.missingSkills).toEqual(['react', 'node']);

            // User has skills but job has no requirements -> 0.5 (neutral)
            const res2 = service.calculateSkillMatch(['React'], []);
            expect(res2.score).toBe(0.5);
            expect(res2.matchingSkills).toEqual([]);
        });

        it('resolves aliases properly', () => {
            // Using 'js' should match 'javascript'
            const res = service.calculateSkillMatch(['js', 'ts'], ['javascript', 'typescript', 'python']);
            expect(res.score).toBeCloseTo(0.66, 1);
            expect(res.matchingSkills).toEqual(['javascript', 'typescript']);
            expect(res.missingSkills).toEqual(['python']);
        });
    });
});
