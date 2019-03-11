const bringApi = require(__dirname + `/../lib/bring.js`);
const describe = require(`mocha`).describe;

describe(`Wrong login test`, () => {
    let bring;

    before(done => {
        bring = new bringApi({mail: `example@example.com`, password: `secret`});
        done();
    });

    it(`init should take less than 2000ms`, async () => {
        try {
            await bring.login();
        } catch (e) {
            if (e.includes(`email password combination not existing`)) return Promise.resolve();
        }
    });
});