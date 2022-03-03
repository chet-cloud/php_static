import clone from 'git-clone'

const clone_repo = (repo, targetPath, opts) => {
    return new Promise((yes, no) => {
        clone(repo, targetPath, opts || {}, (err) => {
            console.log(err)
            if (err !== undefined) {
                no(err)
            } else {
                yes()
            }
        });
    });
}


export default async(github) => {
    if (github.startsWith("https://") && github.endsWith(".git")) {
        await clone_repo(github, "./public", { depth: 1 })
    } else {
        console.error(`Illegal git url : ${git}`);
        throw new Error(`Illegal git url : ${git}`);
    }
}