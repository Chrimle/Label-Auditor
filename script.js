
module.exports = async ({ github, context, core }) => {

    const categoriesRequiringSemanticVersion = ['feat', 'bug'];

    const requiredCategories = [
        'bug',
        'dependencies',
        'doc',
        'feat',
        'meta',
        'preview',
        'refactor',
        'security',
        'test'
    ];

    const semanticVersions = ['MAJOR', 'MINOR', 'PATCH'];

    const labels = context.payload.pull_request.labels;
    if (labels.filter(label => requiredCategories.includes(label.name)).length == 0) {
        throw new Error(`Pull Request requires one of the following labels: ${requiredCategories.join(', ')}`);
    }
    if (labels.filter(label => categoriesRequiringSemanticVersion.includes(label.name)).length > 0) {
        if (labels.filter(label => semanticVersions.includes(label.name)).length == 0) {
            throw new Error(`Pull Request requires a 'Semantic version'-label for the following labels: ${categoriesRequiringSemanticVersion.join(', ')}`);
        }
    }
};

