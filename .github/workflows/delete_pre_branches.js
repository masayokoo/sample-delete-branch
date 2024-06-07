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

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    for (const branch of branches) {
      const branchName = branch.name;

      // ブランチ名に -pre が含まれているかチェック
      if (branchName.includes('-pre')) {
        // ブランチの詳細を取得して最終更新日時を確認
        const { data: branchDetails } = await octokit.repos.getBranch({
          owner: repoOwner,
          repo: repoName,
          branch: branchName,
        });

        const branchDate = new Date(branchDetails.commit.commit.author.date);

        // ブランチが前日以前に作成されたか確認
        if (branchDate < yesterday) {
          // ブランチを削除
          await octokit.git.deleteRef({
            owner: repoOwner,
            repo: repoName,
            ref: `heads/${branchName}`,
          });

          console.log(`Deleted branch: ${branchName}`);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

run();
