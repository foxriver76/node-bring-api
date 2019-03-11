const bringApi = require(__dirname + `/../lib/bring.js`);


describe(`Wrong login test`, () => {
    let bring;

    before(done => {
        bring = new bringApi({mail: `example@example.com`, password: `secret`});
        done();
    });

    it(`init should take less than 2000ms`, async done => {
        try {
            await bring.login();
        } catch (e) {
            if (e.includes(`email password combination not existing`)) done();
        }
    });
});