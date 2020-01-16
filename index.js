const core = require('@actions/core');
const github = require('@actions/github');
const jq = require('node-jq');
const fs = require('fs');
const path = require('path');

try {
    const filterPush        = core.getInput('filter_push');
    const filterPullRequest = core.getInput('filter_pull_request');
    const filterPrefix      = core.getInput('filter_prefix');
    const shouldDump        = core.getInput('dump');
    const dumpPath          = core.getInput('dump_path');
    const shouldPrint       = core.getInput('print');
    const output            = core.getInput('output');
    const slurp             = core.getInput('slurp');
    const sort              = core.getInput('sort');

    const isPullRequest     = github.context.payload.pull_request !== undefined;
    const branch            = isPullRequest ? github.context.payload.pull_request.head.ref : path.basename(github.context.payload.ref);
    const filter            = filterPrefix + (isPullRequest ? filterPullRequest : filterPush);
    
    core.setOutput('pull_request', JSON.stringify(isPullRequest));
    core.setOutput('branch', branch);

    console.log(`Filter: ${filter}`);

    jq.run(filter, JSON.stringify(github.context.payload), {
        input: 'string',
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
        core.startGroup('Payload');
        console.log(payload);
        core.endGroup()
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
