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
exports.createReleaseVersion = createReleaseVersion;
exports.getExistingTags = getExistingTags;
function createReleaseVersion(octokit, requestDefaults) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        const yyyy = date.getUTCFullYear();
        const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(date.getUTCDate()).padStart(2, "0");
        const baseTagName = `v-${yyyy}-${mm}-${dd}`;
        const existingTagNames = yield getExistingTags(octokit, requestDefaults);
        let tagName = baseTagName;
        let index = 0;
        while (existingTagNames.includes(tagName)) {
            index += 1;
            tagName = `${baseTagName}.${index}`;
        }
        return tagName;
    });
}
function getExistingTags(octokit, requestDefaults) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingTags = yield octokit.rest.repos.listTags(Object.assign(Object.assign({}, requestDefaults), { per_page: 100 }));
        return existingTags.data.map(obj => obj.name);
    });
}
//# sourceMappingURL=release.js.map