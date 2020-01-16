# Payload Info

This action extracts info from the webhook payload object in Github Actions using the `jq` tool. If also provides the name of the branch this workflow is running on and if it is a pull request or not. 

## Inputs

### `filter_push`
**Required** Filter to be applied to the webhook payload object in case of a push. Default: `"."`. Learn more about filters at the [jq manual](https://stedolan.github.io/jq/manual/#Basicfilters).

### `filter_pull_request`
Filter to be applied to the webhook payload object in case of a pull request. Default `".pull_request."`. Learn more about filters at the [jq manual](https://stedolan.github.io/jq/manual/#Basicfilters).

### `output`
Type of output. It can be `"pretty"`, `"json"`, `"compact"`, or `"string"`. Default `"pretty"`. ''

### `slurp`
If the output will be surrounded between `[` and `]`. Default `false`.

### `sort`
Sort object keys in alphabetical order. Default `false`.

### `dump`
If the webhook payload for the event that triggered the workflow should be dumped as a JSON file or not.' Default `true`.

### `dump_path`
Path to the JSON payload file to be dumped. Default `"./gh-payload.json"`.

### `print`
If the webhook payload for the event that triggered the workflow should be output. Default `true`.

## Outputs

### `value`
Result after the filter is applied.

### `branch`
Name of the branch related to this workflow.

### `pull_request`
If this workflow is running on a pull request or not.

## Example usage

```yml
# Install all required dependencies
- uses: actions/checkout@v1
- name: Checkout and Node setup
    uses: actions/setup-node@v1
    with:
    node-version: '12.x'
- name: Install dependencies
    run: npm ci
# Use the action
- uses: Dovyski/payload-info-action@master
    with:
        filter_push: '.commits[].author.name'
        filter_pull_request: '.pull_request.commits[].author.name'
```