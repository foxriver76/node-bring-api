interface BringOptions {
    mail: string;
    password: string;
    url?: string;
    uuid?: string;
}

interface GetItemsResponseEntry {
    specification: string;
    name: string;
}

interface GetItemsResponse {
    uuid: string;
    status: string;
    purchase: GetItemsResponseEntry[];
    recently: GetItemsResponseEntry[];
}

interface AuthSuccessResponse {
    name: string;
    uuid: string;
    access_token: string;
    refresh_token: string;
}

interface ErrorResponse {
    message: string;
    error: string;
    error_description: string;
    errorcode: number;
}

type AuthResponse = AuthSuccessResponse | ErrorResponse;

interface GetAllUsersFromListEntry {
    publicUuid: string;
    name: string;
    email: string;
    photoPath: string;
    pushEnabled: boolean;
    plusTryOut: boolean;
    country: string;
    language: string;
}
interface GetAllUsersFromListResponse {
    users: GetAllUsersFromListEntry[];
}

interface LoadListsEntry {
    listUuid: string;
    name: string;
    theme: string;
}

interface LoadListsResponse {
    lists: LoadListsEntry[];
}

interface GetItemsDetailsEntry {
    uuid: string;
    itemId: string;
    listUuid: string;
    userIconItemId: string;
    userSectionId: string;
    assignedTo: string;
    imageUrl: string;
}

interface UserSettingsEntry {
    key: string;
    value: string;
}

interface UserListSettingsEntry {
    listUuid: string;
    usersettings: UserSettingsEntry[];
}

interface GetUserSettingsResponse {
    userSettings: UserSettingsEntry[];
    userlistsettings: UserListSettingsEntry[];
}

interface CatalogItemsEntry {
    itemId: string;
    name: string;
}

interface CatalogSectionsEntry {
    sectionId: string;
    name: string;
    items: CatalogItemsEntry[];
}

interface LoadCatalogResponse {
    language: string;
    catalog: {
        sections: CatalogSectionsEntry[];
    };
}

interface GetPendingInvitationsResponse {
    invitations: any[];
}

interface Image {
    /** the image itself */
    imageData: string;
}

class Bring {
    private readonly mail: string;
    private readonly password: string;
    private readonly url: string;
    private uuid: string;
    private readonly headers: {
        'X-BRING-CLIENT-SOURCE': string;
        'X-BRING-COUNTRY': string;
        'X-BRING-CLIENT': string;
        'X-BRING-API-KEY': string;
        Authorization?: string;
        'X-BRING-USER-UUID'?: string;
    };
    public name?: string;
    private bearerToken?: string;
    private refreshToken?: string;
    private putHeaders?: {
        Authorization?: string;
        'X-BRING-USER-UUID'?: string;
        'X-BRING-CLIENT-SOURCE': string;
        'X-BRING-COUNTRY': string;
        'X-BRING-CLIENT': string;
        'X-BRING-API-KEY': string;
        'Content-Type': string;
    };

    constructor(options: BringOptions) {
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
    }

    /**
     * Try to log into given account
     */
    async login(): Promise<void> {
        let data: AuthResponse;

        try {
            const resp = await fetch(`${this.url}bringauth`, {
                method: 'POST',
                body: new URLSearchParams({ email: this.mail, password: this.password })
            });

            data = await resp.json();
        } catch (e: any) {
            throw new Error(`Cannot Login: ${e.message}`);
        }

        if ('error' in data) {
            throw new Error(`Cannot Login: ${data.message}`);
        }

        this.name = data.name;
        this.uuid = data.uuid;
        this.bearerToken = data.access_token;
        this.refreshToken = data.refresh_token;

        this.headers[`X-BRING-USER-UUID`] = this.uuid;
        this.headers[`Authorization`] = `Bearer ${this.bearerToken}`;
        this.putHeaders = {
            ...this.headers,
            ...{ 'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8` }
        };
    }

    /**
     *   Loads all shopping lists
     */
    async loadLists(): Promise<LoadListsResponse> {
        try {
            const resp = await fetch(`${this.url}bringusers/${this.uuid}/lists`, { headers: this.headers });
            const lists: LoadListsResponse | ErrorResponse = await resp.json();

            if ('error' in lists) {
                throw new Error(lists.message);
            }

            return lists;
        } catch (e: any) {
            throw new Error(`Cannot get lists: ${e.message}`);
        }
    }

    /**
     *   Get all items from the current selected shopping list
     */
    async getItems(listUuid: string): Promise<GetItemsResponse> {
        try {
            const resp = await fetch(`${this.url}bringlists/${listUuid}`, { headers: this.headers });
            const items: GetItemsResponse | ErrorResponse = await resp.json();

            if ('error' in items) {
                throw new Error(items.message);
            }

            return items;
        } catch (e: any) {
            throw new Error(`Cannot get items for list ${listUuid}: ${e.message}`);
        }
    }

    /**
     *   Get detailed information about all items from the current selected shopping list
     */
    async getItemsDetails(listUuid: string): Promise<GetItemsDetailsEntry[]> {
        try {
            const resp = await fetch(`${this.url}bringlists/${listUuid}/details`, { headers: this.headers });
            const items: GetItemsDetailsEntry[] | ErrorResponse = await resp.json();

            if ('error' in items) {
                throw new Error(items.message);
            }

            return items;
        } catch (e: any) {
            throw new Error(`Cannot get detailed items for list ${listUuid}: ${e.message}`);
        }
    }

    /**
     *   Save an item to your current shopping list
     *
     *   @param itemName The name of the item you want to send to the bring server
     *   @param specification The little description under the name of the item
     *   @param listUuid The listUUID you want to receive a list of users from.
     *   returns an empty string and answerHttpStatus should contain 204. If not -> error
     */
    async saveItem(listUuid: string, itemName: string, specification: string): Promise<string> {
        try {
            const resp = await fetch(`${this.url}bringlists/${listUuid}`, {
                method: 'PUT',
                headers: this.putHeaders,
                body: `&purchase=${itemName}&recently=&specification=${specification}&remove=&sender=null`
            });
            return resp.text();
        } catch (e: any) {
            throw new Error(`Cannot save item ${itemName} (${specification}) to ${listUuid}: ${e.message}`);
        }
    }

    /**
     *   Save an image to an item
     *
     *   @param itemUuid The itemUUID which will be updated
     *   @param image The image you want to link to the item
     *   @return returns an imageUrl and answerHttpStatus should contain 204. If not -> error
     */
    async saveItemImage(itemUuid: string, image: Image): Promise<{ imageUrl: string }> {
        try {
            const resp = await fetch(`${this.url}bringlistitemdetails/${itemUuid}/image`, {
                method: 'PUT',
                headers: this.putHeaders,
                body: new URLSearchParams({ ...image })
            });
            const imageObj: { imageUrl: string } | ErrorResponse = await resp.json();

            if ('error' in imageObj) {
                throw new Error(imageObj.message);
            }

            return imageObj;
        } catch (e: any) {
            throw new Error(`Cannot save item image ${itemUuid}: ${e.message}`);
        }
    }

    /**
     *   remove an item from your current shopping list
     *
     *   @param listUuid The listUUID you want to remove a item from
     *   @param itemName Name of the item you want to delete from you shopping list
     *   @return should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    async removeItem(listUuid: string, itemName: string): Promise<string> {
        try {
            const resp = await fetch(`${this.url}bringlists/${listUuid}`, {
                method: 'PUT',
                headers: this.putHeaders,
                body: `&purchase=&recently=&specification=&remove=${itemName}&sender=null`
            });
            return resp.text();
        } catch (e: any) {
            throw new Error(`Cannot remove item ${itemName} from ${listUuid}: ${e.message}`);
        }
    }

    /**
     *   Remove the image from your item
     *
     *   @param itemUuid The itemUUID you want to remove the image from
     *   @return returns an empty string and answerHttpStatus should contain 204. If not -> error
     */
    async removeItemImage(itemUuid: string): Promise<string> {
        try {
            const resp = await fetch(`${this.url}bringlistitemdetails/${itemUuid}/image`, {
                method: 'DELETE',
                headers: this.headers
            });
            return resp.text();
        } catch (e: any) {
            throw new Error(`Cannot remove item image ${itemUuid}: ${e.message}`);
        }
    }

    /**
     *   Move an item to recent items list
     *
     *   @param itemName Name of the item you want to delete from you shopping list
     *   @param listUuid The lisUUID you want to receive a list of users from.
     *   @return Should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    async moveToRecentList(listUuid: string, itemName: string): Promise<string> {
        try {
            const resp = await fetch(`${this.url}bringlists/${listUuid}`, {
                method: 'PUT',
                headers: this.putHeaders,
                body: `&purchase=&recently=${itemName}&specification=&remove=&&sender=null`
            });
            return resp.text();
        } catch (e: any) {
            throw new Error(`Cannot remove item ${itemName} from ${listUuid}: ${e.message}`);
        }
    }

    /**
     *   Get all users from a shopping list
     *
     *   @param listUuid The listUUID you want to receive a list of users from
     */
    async getAllUsersFromList(listUuid: string): Promise<GetAllUsersFromListResponse> {
        try {
            const resp = await fetch(`${this.url}bringlists/${listUuid}/users`, { headers: this.headers });
            const users: GetAllUsersFromListResponse | ErrorResponse = await resp.json();

            if ('error' in users) {
                throw new Error(users.message);
            }

            return users;
        } catch (e: any) {
            throw new Error(`Cannot get users from list: ${e.message}`);
        }
    }

    /**
     * Get the user settings
     */
    async getUserSettings(): Promise<GetUserSettingsResponse> {
        try {
            const resp = await fetch(`${this.url}bringusersettings/${this.uuid}`, { headers: this.headers });
            const settings: GetUserSettingsResponse | ErrorResponse = await resp.json();

            if ('error' in settings) {
                throw new Error(settings.message);
            }

            return settings;
        } catch (e: any) {
            throw new Error(`Cannot get user settings: ${e.message}`);
        }
    }

    /**
     *   Load translation file e. g. via 'de-DE'
     *   @param locale from which country translations will be loaded
     */
    async loadTranslations(locale: string): Promise<Record<string, string>> {
        try {
            const resp = await fetch(`https://web.getbring.com/locale/articles.${locale}.json`);
            const translations: Record<string, string> | ErrorResponse = await resp.json();

            if ('error' in translations) {
                throw new Error(translations.message);
            }

            return translations;
        } catch (e: any) {
            throw new Error(`Cannot get translations: ${e.message}`);
        }
    }

    /**
     *   Load translation file e.g. via 'de-DE'
     *   @param locale from which country translations will be loaded
     */
    async loadCatalog(locale: string): Promise<LoadCatalogResponse> {
        try {
            const resp = await fetch(`https://web.getbring.com/locale/catalog.${locale}.json`);
            const catalog: LoadCatalogResponse | ErrorResponse = await resp.json();

            if ('error' in catalog) {
                throw new Error(catalog.message);
            }

            return catalog;
        } catch (e: any) {
            throw new Error(`Cannot get catalog: ${e.message}`);
        }
    }

    /**
     *   Get pending invitations
     */
    async getPendingInvitations(): Promise<GetPendingInvitationsResponse> {
        try {
            const resp = await fetch(`${this.url}bringusers/${this.uuid}/invitations?status=pending`, {
                headers: this.headers
            });
            const invites: GetPendingInvitationsResponse | ErrorResponse = await resp.json();

            if ('error' in invites) {
                throw new Error(invites.message);
            }

            return invites;
        } catch (e: any) {
            throw new Error(`Cannot get pending invitations: ${e.message}`);
        }
    }
}

export = Bring;
