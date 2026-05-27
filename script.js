module.exports = async ({github, context, core}) => {

    const categoriesRequiringSemanticVersion = process.env.SEMVER_REQ_LABELS.split(',').map(s => s.trim());

    const requiredCategories = process.env.REQ_LABELS.split(',').map(s => s.trim());

    const semanticVersions = process.env.SEMVER_LABELS.split(',').map(s => s.trim());

    const labels = context.payload.pull_request.labels;
    if (labels.filter(label => requiredCategories.includes(label.name)).length === 0) {
        throw new Error(`Pull Request requires one of the following labels: ${requiredCategories.join(', ')}`);
    }
    if (labels.filter(label => categoriesRequiringSemanticVersion.includes(label.name)).length === 0) {
        return;
    }
    if (labels.filter(label => semanticVersions.includes(label.name)).length === 0) {
        throw new Error(`Pull Request requires a 'Semantic version'-label for the following labels: ${categoriesRequiringSemanticVersion.join(', ')}`);
    }
};

