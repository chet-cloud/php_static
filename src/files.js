import fs from 'fs-extra';

/**
 * ensure a empty directory outDir, and copy the contents in fromDir to outDir
 * @param {string} fromDir 
 * @param {string} outDir 
 */
export const copy = (fromDir, outDir) => {
    try {
        if (fs.pathExistsSync(outDir)) {
            console.log(`${outDir} exist`)
            fs.removeSync(outDir)
            console.log(`removed ${outDir}`)
        }
        fs.ensureDirSync(outDir)
        console.log(`created ${outDir}`)
        fs.copySync(fromDir, outDir, {
            filter: (src, dest) => {
                return !src.endsWith(".php")
            }
        })
        console.log(`copied files from ${fromDir} to ${outDir}`)
    } catch (e) {
        console.error("files copy error")
        throw e
    }
}

/**
 * get a file path according to a outDir and a file which is relative path to outDir
 * @param {string} file 
 * @param {string} outDir
 *  file and outDir should start with '/' , './', '../' and not endwith '/'
 * EX:
 *  getPath("/cc/ff/txt.php","./out") is ./out/cc/ff/txt
 *  getPath("/cc/ff","./out") is ./out/cc/ff
 */
export const getPath = (file, outDir) => {
    if (file === '/' || file === '/index.php') {
        return outDir
    }

    if ((!file.startsWith('/') || file.endsWith('/'))) {
        console.error("file should start with / and not endwith /")
        throw new Error(`Illegal name: [file]:${file}`);
    }
    if (!(outDir.startsWith('/') || outDir.startsWith('./') || outDir.startsWith('../')) || outDir.endsWith('/')) {
        console.error("outDir should start with '/', './', or '../' and not endwith '/'")
        throw new Error(`Illegal name: [outDir]:${outDir}`);
    }
    let path = outDir + file;
    if (isPhp(path)) {
        path = path.substring(0, path.lastIndexOf("."))
    }
    return path
}


export const isPhp = (file) => {
    return /.php$/.test(file)
}


/**
 * save string content to a file
 * @param {string} content 
 * @param {string} file 
 * @param {string} outDir
 * @returns void
 */
export const save = (content, file, outDir) => {
    if (isPhp(file)) {
        const newDir = getPath(file, outDir)
        return fs.ensureDir(newDir).then(() => {
            const newFile = `${newDir}/index.html`
            if (fs.pathExistsSync(newFile)) {
                console.log(`html file ${newFile} exist, skip generating fetching html`)
                return new Promise.resolve()
            } else {
                return fs.outputFile(`${newDir}/index.html`, content)
            }
        })
    } else {
        return new Promise.resolve()
    }
}


const isSetRemoteUrl = (remoteUrl) => {
    return (typeof remoteUrl === "string" && remoteUrl.startsWith("http"))
}

const isBuildByGithubAction = () => {
    return !(process.env.BASE_PHP_PATH === undefined || process.env.BASE_PHP_PATH.trim() === "")
}


export const needPhpServer = (remoteUrl) => (!isBuildByGithubAction() && !isSetRemoteUrl(remoteUrl))


export const generateURLs = (files, remoteUrl, requestCallback) => {

    let basePath = ""

    if (isSetRemoteUrl(remoteUrl)) {
        basePath = remoteUrl
    } else {
        basePath = isBuildByGithubAction() ? `${process.env.BASE_PHP_PATH}/public` : `http://localhost:8080/public`
    }

    // generate requrest urls
    const requests = [...files]
        .map((file) => {
            return `${basePath}${file}`
        })
        .map((url) => {
            if (requestCallback instanceof Function) {
                return requestCallback(url)
            } else {
                console.log("request url:" + url)
                return url
            }
        })

    return requests;
}



export const FileManager = async function(fromDir, outDir) {
    await copy(fromDir, outDir)
    return {
        savePhp: (content, file) => save(content, file, outDir),
        requestURLs: (files, remoteURL, requestCallback) => {
            return generateURLs(files, remoteURL, requestCallback)
        }
    }
}