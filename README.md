# monorepo-release-start

This action starts a changeset based release process and provide a unique GitHub release with packages information (including old and new versions), changelogs per package/module and a release notes.

## Inputs

None.

## Outputs

### `version`

Next release version.

### `oldPackagesVersions`

Old package versions.

### `newPackageVersions`

Versions of new packages being released.

### `deployablePackages`

Deployable packages (with "_deployment_" field in _package.json_) found in the monorepo structure.

### `releasedPackages`

Versions of all packages to be released with the new version.

### `releaseOutput`

Output of the changesets release flow.

### `released`

Release feedback. _TRUE_ if release  process started successfully, _FALSE_ otherwise.

## Example usage

```yaml
- name: Start monorepo release
  id: start-monorepo-release  # this can be whatever you'd like. It's just an id so that we can reference the step in github actions
  uses: dh-io-actions/monorepo-release-start@v1.0
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```yaml
- name: Print monorepo release output
  shell: bash
  run: |
      echo New Version: ${{ steps.start-monorepo-release.outputs.version }}
      echo Old Packages: ${{ steps.start-monorepo-release.outputs.oldPackages }}
      echo New Packages: ${{ steps.start-monorepo-release.outputs.newPackages }}
      echo Released Packages: ${{ steps.start-monorepo-release.outputs.releasedPackages }}
      echo Deployable Packages: ${{ steps.start-monorepo-release.outputs.deployablePackages }}
      echo Release Output: ${{ steps.start-monorepo-release.outputs.releaseOutput }}
      echo Was Released?: ${{ steps.start-monorepo-release.outputs.released }}
```

## Release Use-case

```yaml
name: Release

on:
  workflow_dispatch:

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: [ ubuntu-latest ]
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Setup Node.js 12.x
        uses: actions/setup-node@v4
        with:
          node-version: 14.x

      - name: Install Dependencies
        run: yarn install

      - name: Start monorepo release
        id: start-monorepo-release
        uses: manusant/monorepo-release-start@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Finish monorepo release
        id: finish-monorepo-release
        if: steps.start-monorepo-release.outputs.released
        uses: manusant/monorepo-release-finish@v1
        with:
          branch: develop
          version: ${{ steps.start-monorepo-release.outputs.version }}
          previousPackages: ${{ steps.start-monorepo-release.outputs.oldPackages }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
