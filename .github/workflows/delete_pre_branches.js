const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoOwner = process.env.GITHUB_REPOSITORY.split('/')[0];
const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];

async function run() {
  try {
    // リポジトリのブランチを取得
    const { data: branches } = await octokit.repos.listBranches({
      owner: repoOwner,
      repo: repoName,
    });

    for (const branch of branches) {
      const branchName = branch.name;

      // ブランチ名に -pre が含まれているかチェック
      if (branchName.includes('-pre')) {
        await octokit.git.deleteRef({
          owner: repoOwner,
          repo: repoName,
          ref: `heads/${branchName}`,
        });

        console.log(`Deleted branch: ${branchName}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

run();
