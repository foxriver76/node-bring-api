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
declare class Bring {
    private readonly mail;
    private readonly password;
    private readonly url;
    private uuid;
    private readonly headers;
    name?: string;
    private bearerToken?;
    private refreshToken?;
    private putHeaders?;
    constructor(options: BringOptions);
    /**
     * Try to log into given account
     */
    login(): Promise<void>;
    /**
     *   Loads all shopping lists
     */
    loadLists(): Promise<LoadListsResponse>;
    /**
     *   Get all items from the current selected shopping list
     */
    getItems(listUuid: string): Promise<GetItemsResponse>;
    /**
     *   Get detailed information about all items from the current selected shopping list
     */
    getItemsDetails(listUuid: string): Promise<GetItemsDetailsEntry[]>;
    /**
     *   Save an item to your current shopping list
     *
     *   @param itemName The name of the item you want to send to the bring server
     *   @param specification The litte description under the name of the item
     *   @param listUuid The listUUID you want to receive a list of users from.
     *   returns an empty string and answerHttpStatus should contain 204. If not -> error
     */
    saveItem(listUuid: string, itemName: string, specification: string): Promise<string>;
    /**
     *   Save an image to an item
     *
     *   @param itemUuid The itemUUID which will be updated
     *   @param image The image you want to link to the item
     *   returns an imageUrl and answerHttpStatus should contain 204. If not -> error
     */
    saveItemImage(itemUuid: string, image: Image): Promise<{
        imageUrl: string;
    }>;
    /**
     *   remove an item from your current shopping list
     *
     *   @param listUuid The listUUID you want to remove a item from
     *   @param itemName Name of the item you want to delete from you shopping list
     *   should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    removeItem(listUuid: string, itemName: string): Promise<string>;
    /**
     *   Remove the image from your item
     *
     *   @param itemUuid The itemUUID you want to remove the image from
     *   returns an empty string and answerHttpStatus should contain 204. If not -> error
     */
    removeItemImage(itemUuid: string): Promise<string>;
    /**
     *   move an item to recent items list
     *
     *   @param itemName Name of the item you want to delete from you shopping list
     *   @param listUuid The lisUUID you want to receive a list of users from.
     *   should return an empty string and $answerHttpStatus should contain 204. If not -> error
     */
    moveToRecentList(listUuid: string, itemName: string): Promise<string>;
    /**
     *   Get all users from a shopping list
     *
     *   @param listUuid The listUUID you want to receive a list of users from
     */
    getAllUsersFromList(listUuid: string): Promise<GetAllUsersFromListResponse>;
    /**
     * Get the user settings
     */
    getUserSettings(): Promise<GetUserSettingsResponse>;
    /**
     *   Load translation file e. g. via 'de-DE'
     *   @param locale from which country translations will be loaded
     */
    loadTranslations(locale: string): Promise<Record<string, string>>;
    /**
     *   Load translation file e. g. via 'de-DE'
     *   @param locale from which country translations will be loaded
     */
    loadCatalog(locale: string): Promise<LoadCatalogResponse>;
    /**
     *   Get pending invitations
     */
    getPendingInvitations(): Promise<GetPendingInvitationsResponse>;
}
export = Bring;
