import test from 'ava';
import { getPath, generateURLs } from '../src/files.js'
import staticky from '../src/static.js'

test('getPath', t => {
    t.assert(getPath("/cc/ff/txt.php", "./out") === "./out/cc/ff/txt");
    t.assert(getPath("/cc/ff", "./out") === "./out/cc/ff");
    t.assert(getPath("/", "./out") === "./out");
    t.assert(getPath("/index.php", "./out") === "./out");
    t.assert(getPath("/index.html", "./out") === "./out/index.html");
});

test('getPath_exception', t => {
    const error = t.throws(() => {
        getPath("cc/ff/txt.php", "./out");
    });
    t.assert(error.message.startsWith('Illegal name'));
});
Array['equal'] = (a, b) => {
    if (!a instanceof Array || !b instanceof Array) {
        return false
    }
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i]) {
            continue
        } else {
            return false
        }
    }
    return true
}

test('generateURLs', t => {


    t.assert(Array.equal(
        generateURLs(['/1', '/2', '/3', '/4', '/5']), [
            'http://localhost:8080/public/1',
            'http://localhost:8080/public/2',
            'http://localhost:8080/public/3',
            'http://localhost:8080/public/4',
            'http://localhost:8080/public/5'
        ]))


    t.assert(Array.equal(
        generateURLs(['/1', '/2', '/3', '/4', '/5'], "http://localhost"), [
            'http://localhost/1',
            'http://localhost/2',
            'http://localhost/3',
            'http://localhost/4',
            'http://localhost/5'
        ]))



    process.env.BASE_PHP_PATH = "http://xxxxx/fff"

    t.assert(Array.equal(
        generateURLs(['/1', '/2', '/3', '/4', '/5']), [
            'http://xxxxx/fff/public/1',
            'http://xxxxx/fff/public/2',
            'http://xxxxx/fff/public/3',
            'http://xxxxx/fff/public/4',
            'http://xxxxx/fff/public/5'
        ]))
})


test('generate static website', async t => {
    try {
        await staticky({
            files: [
                "/test/404.php",
                "/test/index.php"
            ],
            remoteUrl: "",
            github: "https://github.com/chet-cloud/php_static.git"
        })
        t.pass()
    } catch (e) {
        t.fail()
    }
})