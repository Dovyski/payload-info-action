const core = require('@actions/core');
const github = require('@actions/github');
const jq = require('node-jq');
const fs = require('fs');

try {
    const filterPush        = core.getInput('filter_push');
    const filterPullRequest = core.getInput('filter_pull_request');
    const shouldDump        = core.getInput('dump');
    const dumpPath          = core.getInput('dump_path');
    const shouldPrint       = core.getInput('print');
    const output            = core.getInput('output');
    const slurp             = core.getInput('slurp');
    const sort              = core.getInput('sort');

    const isPullRequest     = github.context.payload.pull_request !== undefined;
    const branch            = isPullRequest ? github.context.payload.pull_request.head.ref : github.context.payload.base_ref;
    const filter            = isPullRequest ? filterPullRequest : filterPush;
    
    core.setOutput('pull_request', JSON.stringify(isPullRequest));
    core.setOutput('branch', branch);

    jq.run(filter, github.context.payload, {
        input: 'json',
        output: output || 'pretty',
        slurp: Boolean(slurp),
        sort: Boolean(sort)
    })
    .then((output) => {
        core.setOutput('value', output);
    })
    .catch((err) => {
        core.setFailed(err);
    });
        
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);

    if(shouldPrint) {
        console.log(`Payload: ${payload}`);
    }

    if(shouldDump) {
        fs.writeFile(dumpPath, payload, function(err) {
            if(err) {
                core.setFailed(err);
            }
            console.log(`Payload dump file saved at "${dumpPath}".`);
        });
    }
} catch (error) {
    core.setFailed(error.message);
}
