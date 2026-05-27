const checkLabels = require('./script');

describe('PR Label Validator', () => {
    let context;

    // Set up the environment variables before running the tests
    beforeAll(() => {
        process.env.REQ_LABELS = 'bug, feature, chore';
        process.env.SEMVER_REQ_LABELS = 'feature, bug';
        process.env.SEMVER_LABELS = 'major, minor, patch';
    });

    // Reset the context object before each test
    beforeEach(() => {
        context = {
            payload: {
                pull_request: {
                    labels: []
                }
            }
        };
    });

    it('throws an error if no required category labels are present', async () => {
        context.payload.pull_request.labels = [{ name: 'documentation' }];

        // We expect the async function to throw, so we use rejects.toThrow
        await expect(checkLabels({ context })).rejects.toThrow(
            "Pull Request requires one of the following labels: bug, feature, chore"
        );
    });

    it('returns early if the category does not require a semantic version', async () => {
        // 'chore' is required, but not in SEMVER_REQ_LABELS
        context.payload.pull_request.labels = [{ name: 'chore' }];

        // If it resolves without throwing, the test passes
        await expect(checkLabels({ context })).resolves.toBeUndefined();
    });

    it('throws an error if a semantic version is required but missing', async () => {
        // 'feature' is in SEMVER_REQ_LABELS, so it needs a semver label
        context.payload.pull_request.labels = [{ name: 'feature' }];

        await expect(checkLabels({ context })).rejects.toThrow(
            "Pull Request requires a 'Semantic version'-label for the following labels: feature, bug"
        );
    });

    it('passes successfully when all required and semver labels are present', async () => {
        context.payload.pull_request.labels = [
            { name: 'feature' },
            { name: 'minor' }
        ];

        await expect(checkLabels({ context })).resolves.toBeUndefined();
    });
});