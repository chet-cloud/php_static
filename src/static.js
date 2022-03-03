import { start, stop } from './phpServer.js';
import got from './request.js';
import { FileManager, needPhpServer } from './files.js';
import gitClone from './git.js'


/**
 * Convert a php website to static files
 * 
 * @param {string[]} files
 * 
 *  files = [
 *      "/404.php",
 *      "/index.php",
 *      "/winnipeg-apartment-for-rent.php",
 *      "/inquiries.php"
 *  ];
 *
 * @param {string} remoteUrl. 
 *      If remoteUrl is not available, a local php enviroment will setup
 *      // fetch html from this url
 *      const remoteUrl="https://artisplayground.azurewebsites.net/300mainwebsitev2" 
 *      // fetch html from local environment
 *      const remoteUrl=""
 * @param {Function} requestCallback 
 * 
 * @param {function} saveCallback 
 * 
 * @param {string} github 
 */
export default async({ files, remoteUrl, requestCallback, saveCallback, github }) => {

    if (needPhpServer(remoteUrl)) await start();

    console.log(`================================ Begin to clone submodules project ================================`)
    await gitClone(github)
    console.log(`================================ Begin to clone submodules project ================================`)


    const fileManager = await FileManager("./public", "./out")

    const requests = fileManager.requestURLs(files, remoteUrl, requestCallback).map(url => got(url))

    console.log(`================================ Begin to fetch pages ================================`)

    return Promise.all([...requests])
        .then((results) => {
            results.forEach((response, index) => {
                if (saveCallback instanceof Function) {
                    const { data, file } = saveCallback(response.data, files[index])
                    fileManager.savePhp(data, file).then(() => {
                        console.log(`${response.request.res.responseUrl} : ok`)
                    })
                } else {
                    fileManager.savePhp(response.data, files[index]).then(() => {
                        console.log(`${response.request.res.responseUrl} : ok`)
                    })
                }
            })
        })
        .catch((result) => {
            if (result.config && result.response && result.response.status) {
                console.error(result.config.url + " : " + result.response.status)
            }
            //throw result
        }).finally(() => {
            console.log(`================================ fetch pages finished ================================`)
            stop()
        })
}