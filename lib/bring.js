/*jshint -W061 */ // ignore "eval can be harmful"
'use strict';

const request = require(`request-promise-native`);

class Bring {
    constructor(options) {
        this.mail = options.mail;
        this.password = options.password;
        this.url = options.url || `https://api.getbring.com/rest/`;
        this.uuid = options.uuid || ``;
    } // endConstructor

    async login() {
        let data;
        try {
            data = await request(encodeURI(`${this.url}bringlists?email=${this.mail}&password=${this.password}`));
        } catch (e) {
            throw `Cannot Login: ${e}`;
        } // endCatch

        data = JSON.parse(data);
        this.name = data.name;
        this.uuid = data.uuid;
        this.headers = {
            'X-BRING-API-KEY': `cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp`,
            'X-BRING-CLIENT': `android`,
            'X-BRING-USER-UUID': this.uuid,
            'X-BRING-VERSION': `303070050`,
            'X-BRING-COUNTRY': `de`
        };

        this.putHeaders = {...this.headers, ...{'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`}};

        return Promise.resolve();
    } // endLogin

    /**
     *   Loads all shopping lists
     *
     *   @return {json}
     */
    async loadLists() {
        try {
            const data = await request(`${this.url}bringusers/${this.uuid}/lists`, {headers: this.headers});
            return Promise.resolve(JSON.parse(data));
        } catch (e) {
            return Promise.reject(`Cannot get lists: ${e}`);
        } // endCatch
    } // endLoadLists

    /**
     *   Get all items from the current selected shopping list
     *
     *   @return {json}
     */
    async getItems(listUuid) {
        try {
            const data = await request(`${this.url}bringlists/${listUuid}`, {headers: this.headers});
            return Promise.resolve(JSON.parse(data));
        } catch (e) {
            return Promise.reject(`Cannot get lists: ${e}`);
        } // endCatch
    } // endGetItems

    /**
     *   Save an item to your current shopping list
     *
     *   @param {string} itemName The name of the item you want to send to the bring server
     *   @param {string} specification The litte description under the name of the item
     *   @param {string} listUuid The lisUUID you want to receive a list of users from.
     *   @return should return an empty string and answerHttpStatus should contain 204. If not -> error
     */
    async saveItem(listUuid, itemName, specification) {
        try {
            const data = await request.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=${itemName}&recently=&specification=${specification}&remove=&sender=null`
            });
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(`Cannot save item ${itemName} (${specification}) to ${listUuid}: ${e}`);
        } // endCatch
    } // endSaveItem

    /**
     *   remove an item from your current shopping list
     *
     *   @param {string} itemName Name of the item you want to delete from you shopping list
     *   @param {string} listUuid The lisUUID you want to receive a list of users from.
     *   @return should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    async removeItem(listUuid, itemName) {
        try {
            const data = await request.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=&recently=&specification=&remove=${itemName}&sender=null`
            });
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(`Cannot remove item ${itemName} from ${listUuid}: ${e}`);
        } // endCatch
    } // endRemoveItem

    /**
     *   move an item to recent items list
     *
     *   @param {string} itemName Name of the item you want to delete from you shopping list
     *   @param {string} listUuid The lisUUID you want to receive a list of users from.
     *   @return should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    async moveToRecentList(listUuid, itemName) {
        try {
            const data = await request.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=&recently=${itemName}&specification=&remove=&&sender=null`
            });
            return Promise.resolve(data);
        } catch (e) {
            return Promise.reject(`Cannot remove item ${itemName} from ${listUuid}: ${e}`);
        } // endCatch
    } // endRemoveItem

    /**
     *   Get all users from a shopping list
     *
     *   @param {string} listUuid The lisUUID you want to receive a list of users from.
     *   @return {json}
     */
    async getAllUsersFromList(listUuid) {
        try {
            const data = await request(`${this.url}bringlists/${listUuid}/users`, {headers: this.headers});
            return Promise.resolve(JSON.parse(data));
        } catch (e) {
            return Promise.reject(`Cannot get users from list: ${e}`);
        } // endCatch
    } // endGetAllUsersFromList


    /**
     *   @return json
     */
    async getUserSettings() {
        try {
            const data = await request(`${this.url}bringusersettings/${this.uuid}`, {headers: this.headers});
            return Promise.resolve(JSON.parse(data));
        } catch (e) {
            return Promise.reject(`Cannot get user settings: ${e}`);
        } // endCatch
    } // endGetUserSettings

} // endClassBring

module.exports = Bring;