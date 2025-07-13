import { JsonPackage } from "./types";
export declare function readPackages(): Promise<JsonPackage[]>;
export declare function releasedPackages(oldPackages: JsonPackage[]): Promise<JsonPackage[]>;
export declare function deployablePackages(newPackages: JsonPackage[], releasedPackagesVersions: JsonPackage[]): Promise<JsonPackage[]>;
export declare function wasReleased(pkg: JsonPackage, oldPackages: JsonPackage[]): boolean;
