// test.js
const assert = require('assert');
const checkLabels = require('./script.js');

// 1. Set up the environment variables
process.env.REQ_LABELS = 'bug, feature, chore';
process.env.SEMVER_REQ_LABELS = 'feature, bug';
process.env.SEMVER_LABELS = 'major, minor, patch';

async function runTests() {
    console.log('Starting tests...\n');

    let hasFailed = false;

    // TEST 1: Throws error if missing required category
    try {
        const context = { payload: { pull_request: { labels: [{ name: 'documentation' }] } } };
        await assert.rejects(
            checkLabels({ context }),
            Error,
            "Expected script to throw when required labels are missing"
        );
        console.log('✅ Passed: Missing required category throws error');
    } catch (err) {
        console.error('❌ Failed: Test 1', err.message);
        hasFailed = true;
    }

    // TEST 2: Returns early (succeeds) if category doesn't need semver
    try {
        const context = { payload: { pull_request: { labels: [{ name: 'chore' }] } } };
        await assert.doesNotReject(
            checkLabels({ context })
        );
        console.log('✅ Passed: Category without semver requirement succeeds');
    } catch (err) {
        console.error('❌ Failed: Test 2', err);
        hasFailed = true;
    }

    // TEST 3: Throws error if semver is required but missing
    try {
        const context = { payload: { pull_request: { labels: [{ name: 'feature' }] } } };
        await assert.rejects(
            checkLabels({ context }),
            /Pull Request requires a 'Semantic version'-label/,
            "Expected script to throw when semver is missing"
        );
        console.log('✅ Passed: Missing semver throws error');
    } catch (err) {
        console.error('❌ Failed: Test 3', err.message);
        hasFailed = true;
    }

    // TEST 4: Succeeds when all labels are correct
    try {
        const context = { payload: { pull_request: { labels: [{ name: 'feature' }, { name: 'minor' }] } } };
        await assert.doesNotReject(
            checkLabels({ context })
        );
        console.log('✅ Passed: Valid labels succeed');
    } catch (err) {
        console.error('❌ Failed: Test 4', err);
        hasFailed = true;
    }

    if (hasFailed) {
        process.exit(1);
    }
}

runTests();