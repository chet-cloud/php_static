import phpServer from 'php-server';

let server = null

export const start = async () => {
    if (server === null) {
        //process.env['BASE_PHP_PATH'] = "http://localhost:8080";
        // setup php server
        // php -S localhost:8080 -t ../300main_front_v2_nextjs/public
        server = await phpServer({ base: ".", port: 8080 });
        console.log(`dev environment set up [${server.url}]`)
    }
}

export const stop = () => {
    if (server != null) {
        server.stop()
        console.log(`dev environment stop `)
    }
}