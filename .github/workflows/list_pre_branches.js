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

    const preBranches = [];

    for (const branch of branches) {
      const branchName = branch.name;

      // ブランチ名に -pre が含まれているかチェック
      if (branchName.includes('-pre')) {
        preBranches.push(branchName);
      }
    }

    if (preBranches.length > 0) {
      console.log('Branches with -pre:');
      preBranches.forEach(branch => console.log(branch));
    } else {
      console.log('No branches with -pre found.');
    }
  } catch (error) {
    console.error(error);
  }
}

run();
