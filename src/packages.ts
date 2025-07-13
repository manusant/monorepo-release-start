import { JsonPackage } from "./types";
import { getPackages } from "@manypkg/get-packages";

export async function readPackages(): Promise<JsonPackage[]> {
    const {packages} = await getPackages(process.cwd());
    return packages.map(pkg => {
        return {
            path: pkg.dir,
            version: pkg.packageJson.version,
            // Custom field for deployable packages
            deployment: (pkg.packageJson as any).deployment
        };
    });
}

export async function releasedPackages(oldPackages: JsonPackage[]): Promise<JsonPackage[]> {
    const packages = await readPackages();
    return packages.filter(pkg => wasReleased(pkg, oldPackages));
}

export async function deployablePackages(newPackages: JsonPackage[], releasedPackagesVersions: JsonPackage[]): Promise<JsonPackage[]> {
    return newPackages.filter(pkg => pkg.deployment)
        .map(pkg => {
                pkg.released = releasedPackagesVersions.some(releasedPkg =>
                    releasedPkg.path === pkg.path
                    && releasedPkg.deployment === pkg.deployment
                );
                return pkg;
            }
        );
}

export function wasReleased(pkg: JsonPackage, oldPackages: JsonPackage[]): boolean {
    const foundPkg = oldPackages.find(oldPkg => oldPkg.path === pkg.path);
    return foundPkg ? foundPkg.version !== pkg.version : false;
}
