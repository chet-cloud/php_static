import clone from 'git-clone/promise.js'
import fs from 'fs-extra';

export default async(github) => {
    await fs.removeSync("./public")
    if (github.startsWith("https://") && github.endsWith(".git")) {
        await clone(github, "./public", { depth: 1 })
    } else {
        console.error(`Illegal git url : ${git}`);
        throw new Error(`Illegal git url : ${git}`);
    }
}