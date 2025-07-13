export async function createReleaseVersion(octokit, requestDefaults) {
  const date = new Date();
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const baseTagName = `v-${yyyy}-${mm}-${dd}`;

  const existingTagNames = await getExistingTags(octokit, requestDefaults);

  let tagName = baseTagName;
  let index = 0;
  while (existingTagNames.includes(tagName)) {
    index += 1;
    tagName = `${baseTagName}.${index}`;
  }
  return tagName;
}

export async function getExistingTags(octokit, requestDefaults) {
  const existingTags = await octokit.rest.repos.listTags({
    ...requestDefaults,
    per_page: 100
  });
  return existingTags.data.map(obj => obj.name);
}
