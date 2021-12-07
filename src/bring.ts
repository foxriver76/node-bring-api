'use strict';

import request from "request-promise-native";

interface BringOptions {
    mail: string,
    password: string,
    url?: string,
    uuid?: string
}

interface GetItemsResponseEntry {
    specification: string,
    name: string
}

interface GetItemsResponse {
    uuid: string,
    status: string,
    purchase: GetItemsResponseEntry[],
    rececently: GetItemsResponseEntry[]
}

interface GetAllUsersFromListEntry {
    publicUuid: string,
    name: string,
    email: string,
    photoPath: string,
    pushEnabled: boolean,
    plusTryOut: boolean,
    country: string,
    language: string
}
interface GetAllUsersFromListResponse {
    users: GetAllUsersFromListEntry[]
}

interface LoadListsEntry {
    listUuid: string,
    name: string,
    theme: string
}

interface LoadListsFresponse {
    lists: LoadListsEntry[]
}

interface GetItemsDetailsEntry {
    uuid: string,
    itemId: string,
    listUuid: string,
    userIconItemId: string,
    userSectionId: string,
    assignedTo: string,
    imageUrl: string
}

interface UserSettingsEntry {
    key: string,
    value: string
}

interface UserListSettingsEntry {
    listUuid: string,
    usersettings: UserSettingsEntry[]
}

interface GetUserSettingsResponse {
    userSettings: UserSettingsEntry[],
    userlistsettings: UserListSettingsEntry[]
}

interface CatalogItemsEntry {
    itemId: string,
    name: string
}

interface CatalogSectionsEntry {
    sectionId: string,
    name: string,
    items: CatalogItemsEntry[]
}

interface LoadCatalogResponse {
    language: string,
    catalog: {
        sections: CatalogSectionsEntry[]
    }
}

interface GetPendingInvitationsResponse {
    invitations: any[]
}

class Bring {
    private readonly mail: string;
    private readonly password: string;
    private readonly url: string;
    private uuid: string;
    private readonly headers: { "X-BRING-CLIENT-SOURCE": string; "X-BRING-COUNTRY": string; "X-BRING-CLIENT": string; "X-BRING-API-KEY": string, Authorization?: string, "X-BRING-USER-UUID"?: string };
    public name?: string;
    private bearerToken?: string;
    private refreshToken?: string;
    private putHeaders?: { Authorization?: string; "X-BRING-USER-UUID"?: string; "X-BRING-CLIENT-SOURCE": string; "X-BRING-COUNTRY": string; "X-BRING-CLIENT": string; "X-BRING-API-KEY": string; "Content-Type": string };

    constructor(options:BringOptions) {
        this.mail = options.mail;
        this.password = options.password;
        this.url = options.url || `https://api.getbring.com/rest/v2/`;
        this.uuid = options.uuid || ``;
        this.headers = {
            'X-BRING-API-KEY': `cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp`,
            'X-BRING-CLIENT': `webApp`,
            'X-BRING-CLIENT-SOURCE': `webApp`,
            'X-BRING-COUNTRY': `DE`
        };
    } // endConstructor

    /**
     * Try to log into given account
     */
    async login(): Promise<void> {
        let data;
        try {
            data = await request.post(`${this.url}bringauth`,
                {
                    form: {
                        email: this.mail,
                        password: this.password
                    }
                });
        } catch (e: any) {
            throw new Error(`Cannot Login: ${e.message}`);
        } // endCatch

        data = JSON.parse(data);
        this.name = data.name;
        this.uuid = data.uuid;
        this.bearerToken = data.access_token;
        this.refreshToken = data.refresh_token;

        this.headers[`X-BRING-USER-UUID`] = this.uuid;
        this.headers[`Authorization`] = `Bearer ${this.bearerToken}`;
        this.putHeaders = {...this.headers, ...{'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`}};
    } // endLogin

    /**
     *   Loads all shopping lists
     */
    async loadLists(): Promise<LoadListsFresponse> {
        try {
            const data = await request(`${this.url}bringusers/${this.uuid}/lists`, {headers: this.headers});
            return  JSON.parse(data);
        } catch (e: any) {
            throw new Error(`Cannot get lists: ${e.message}`);
        } // endCatch
    } // endLoadLists

    /**
     *   Get all items from the current selected shopping list
     */
    async getItems(listUuid:string): Promise<GetItemsResponse> {
        try {
            const data = await request(`${this.url}bringlists/${listUuid}`, {headers: this.headers});
            return JSON.parse(data);
        } catch (e: any) {
            throw new Error(`Cannot get items for list ${listUuid}: ${e.message}`);
        } // endCatch
    } // endGetItems

    /**
     *   Get detailed information about all items from the current selected shopping list
     */
    async getItemsDetails(listUuid: string): Promise<GetItemsDetailsEntry[]> {
        try {
            const data = await request(`${this.url}bringlists/${listUuid}/details`, {headers: this.headers});
            return JSON.parse(data);
        } catch (e: any) {
            throw new Error(`Cannot get detailed items for list ${listUuid}: ${e.message}`);
        } // endCatch
    } // endGetItemsDetails

    /**
     *   Save an item to your current shopping list
     *
     *   @param itemName The name of the item you want to send to the bring server
     *   @param specification The litte description under the name of the item
     *   @param listUuid The listUUID you want to receive a list of users from.
     *   returns an empty string and answerHttpStatus should contain 204. If not -> error
     */
    async saveItem(listUuid:string, itemName:string, specification:string): Promise<string> {
        try {
            const data = await request.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=${itemName}&recently=&specification=${specification}&remove=&sender=null`
            });
            return data;
        } catch (e: any) {
            throw new Error(`Cannot save item ${itemName} (${specification}) to ${listUuid}: ${e.message}`);
        } // endCatch
    } // endSaveItem

    /**
     *   remove an item from your current shopping list
     *
     *   @param itemName Name of the item you want to delete from you shopping list
     *   @param listUuid The lisUUID you want to receive a list of users from.
     *   should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    async removeItem(listUuid:string, itemName:string): Promise<string> {
        try {
            const data = await request.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=&recently=&specification=&remove=${itemName}&sender=null`
            });
            return data;
        } catch (e: any) {
            throw new Error(`Cannot remove item ${itemName} from ${listUuid}: ${e.message}`);
        } // endCatch
    } // endRemoveItem

    /**
     *   move an item to recent items list
     *
     *   @param itemName Name of the item you want to delete from you shopping list
     *   @param listUuid The lisUUID you want to receive a list of users from.
     *   should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    async moveToRecentList(listUuid:string, itemName:string): Promise<string> {
        try {
            const data = await request.put(`${this.url}bringlists/${listUuid}`, {
                headers: this.putHeaders,
                body: `&purchase=&recently=${itemName}&specification=&remove=&&sender=null`
            });
            return data;
        } catch (e: any) {
            throw new Error(`Cannot remove item ${itemName} from ${listUuid}: ${e.message}`);
        } // endCatch
    } // endRemoveItem

    /**
     *   Get all users from a shopping list
     *
     *   @param listUuid The listUUID you want to receive a list of users from
     */
    async getAllUsersFromList(listUuid: string): Promise<GetAllUsersFromListResponse> {
        try {
            const data = await request(`${this.url}bringlists/${listUuid}/users`, {headers: this.headers});
            return JSON.parse(data);
        } catch (e: any) {
            throw new Error(`Cannot get users from list: ${e.message}`);
        } // endCatch
    } // endGetAllUsersFromList

    /**
     * Get the user settings
     */
    async getUserSettings(): Promise<GetUserSettingsResponse> {
        try {
            const data = await request(`${this.url}bringusersettings/${this.uuid}`, {headers: this.headers});
            return JSON.parse(data);
        } catch (e: any) {
            throw new Error(`Cannot get user settings: ${e.message}`);
        } // endCatch
    } // endGetUserSettings

    /**
     *   Load translation file e. g. via 'de-DE'
     *   @param locale from which country translations will be loaded
     */
    async loadTranslations(locale: string): Promise<Record<string, string>> {
        try {
            const data = await request(`https://web.getbring.com/locale/articles.${locale}.json`);
            return JSON.parse(data);
        } catch (e: any) {
            throw new Error(`Cannot get translations: ${e.message}`);
        } // endCatch
    } // endLoadTranslations

    /**
     *   Load translation file e. g. via 'de-DE'
     *   @param locale from which country translations will be loaded
     */
    async loadCatalog(locale: string): Promise<LoadCatalogResponse> {
        try {
            const data = await request(`https://web.getbring.com/locale/catalog.${locale}.json`);
            return JSON.parse(data);
        } catch (e: any) {
            throw new Error(`Cannot get catalog: ${e.message}`);
        } // endCatch
    } // endLoadCatalog

    /**
     *   Get pending invitations
     */
    async getPendingInvitations(): Promise<GetPendingInvitationsResponse> {
        try {
            const data = await request(`${this.url}bringusers/${this.uuid}/invitations?status=pending`, {headers: this.headers});
            return JSON.parse(data);
        } catch (e: any) {
            throw new Error(`Cannot get pending invitations: ${e.message}`);
        } // endCatch
    } // endGetPendingInvitations
}

export = Bring;
