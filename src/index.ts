import { readPackages, releasedPackages, deployablePackages } from "./packages";
import { getOctokit, context } from "@actions/github";
import { exec } from "@actions/exec";
import { setFailed, setOutput } from "@actions/core";
import { which } from "@actions/io";
import { createReleaseVersion } from "./release";

async function execCommand(command, args) {
    const execPath = await which(command, true);

    let output = "";
    const env = {
        ...process.env
    };

    const options: any = {env};
    options.listeners = {
        stdout: data => {
            output += data.toString();
        }
    };

    const exitCode = await exec(execPath, args, options);
    if (exitCode !== 0) {
        setFailed(`Failed executing command ${exitCode}`);
    }
    return output;
}

function githubDefaults() {
    return {
        ...context.repo,
        /**
         * This accept header is required when calling App APIs in GitHub Enterprise.
         * It has no effect on calls to github.com
         */
        headers: {
            Accept: "application/vnd.github.machine-man-preview+json"
        }
    };
}

async function run() {

    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
        setFailed("Please add the GITHUB_TOKEN to the monorepo-release-start action env");
        return;
    }

    const octokit = getOctokit(githubToken);
    const defaults = githubDefaults();

    // Read encoded project packages and versions before applying changesets
    const oldPackagesVersions = await readPackages();
    setOutput("oldPackages", oldPackagesVersions);

    //Install changesets cli
    await execCommand("npm", ["install", "-g", "@changesets/cli"]);

    // Release preview
    await execCommand("npx", ["changeset", "status", "--verbose", "--output"]);

    // Start release
    const releaseOutput = await execCommand("npx", ["changeset", "version"]);
    const released = releaseOutput.includes("All files have been updated");

    setOutput("releaseOutput", releaseOutput);
    setOutput("released", released);

    if (released) {
        const newPackages = await readPackages();
        setOutput("allPackages", newPackages);

        const releasedPackagesVersions = await releasedPackages(oldPackagesVersions);
        setOutput("releasedPackages", releasedPackagesVersions);

        const deployablePkgs = await deployablePackages(newPackages, releasedPackagesVersions);
        setOutput("deployablePackages", deployablePkgs);

        // create next release version
        let nextReleaseVersion;
        if (newPackages.length == 1) {
            console.log(
                '\nSingle Package mode will use the package version as the release version.',
            );
            nextReleaseVersion = `v${releasedPackagesVersions[0].version}`;
        } else {
            nextReleaseVersion = await createReleaseVersion(octokit, defaults);
        }
        setOutput("version", nextReleaseVersion);

        console.log(
            `Release start status: {Release:${nextReleaseVersion}, released:${released}}`
        );
    }
}

run().catch(error => {
    console.error(error);
    setFailed(`Release Start failed: ${error.message}`);
});
