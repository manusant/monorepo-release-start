"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPackages = readPackages;
exports.releasedPackages = releasedPackages;
exports.deployablePackages = deployablePackages;
exports.wasReleased = wasReleased;
const get_packages_1 = require("@manypkg/get-packages");
function readPackages() {
    return __awaiter(this, void 0, void 0, function* () {
        const { packages } = yield (0, get_packages_1.getPackages)(process.cwd());
        return packages.map(pkg => {
            return {
                path: pkg.dir,
                version: pkg.packageJson.version,
                // Custom field for deployable packages
                deployment: pkg.packageJson.deployment
            };
        });
    });
}
function releasedPackages(oldPackages) {
    return __awaiter(this, void 0, void 0, function* () {
        const packages = yield readPackages();
        return packages.filter(pkg => wasReleased(pkg, oldPackages));
    });
}
function deployablePackages(newPackages, releasedPackagesVersions) {
    return __awaiter(this, void 0, void 0, function* () {
        return newPackages.filter(pkg => pkg.deployment)
            .map(pkg => {
            pkg.released = releasedPackagesVersions.some(releasedPkg => releasedPkg.path === pkg.path
                && releasedPkg.deployment === pkg.deployment);
            return pkg;
        });
    });
}
function wasReleased(pkg, oldPackages) {
    const foundPkg = oldPackages.find(oldPkg => oldPkg.path === pkg.path);
    return foundPkg ? foundPkg.version !== pkg.version : false;
}
//# sourceMappingURL=packages.js.map