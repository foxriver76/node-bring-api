const bringApi = require(`${__dirname}/../build/bring.js`);
const { describe } = require(`mocha`);

describe(`Wrong login test`, () => {
    let bring;

    before(done => {
        bring = new bringApi({ mail: `example@example.com`, password: `secret` });
        done();
    });

    it(`init should take less than 2000ms`, async () => {
        try {
            await bring.login();
        } catch (e) {
            if (!e.message.includes(`email password combination not existing`)) {
                throw new Error(`Wrong rejection message on login: ${e.message}`);
            }
        }
    });
});
