# Node-Bring-Shopping
[![NPM version](http://img.shields.io/npm/v/bring-shopping.svg)](https://www.npmjs.com/package/bring-shopping)
[![Downloads](https://img.shields.io/npm/dm/bring-shopping.svg)](https://www.npmjs.com/package/bring-shopping)
![Build Status](https://github.com/foxriver76/node-bring-api/workflows/Test%20and%20Release/badge.svg)

A node module for Bring! shopping lists entirely written in TypeScript.

## Disclaimer
The developers of this module are in no way endorsed by or affiliated with
Bring! Labs AG, or any associated subsidiaries, logos or trademarks.

## Installation
```npm install bring-shopping --production```

## Usage Example

```javascript
const bringApi = require(`bring-shopping`);

main();

async function main () {
    // provide user and email to login
    const bring = new bringApi({mail: `example@example.com`, password: `secret`});
    
    // login to get your uuid and Bearer token
    try {
        await bring.login();
        console.log(`Successfully logged in as ${bring.name}`);
    } catch (e) {
        console.error(`Error on Login: ${e.message}`);
    }   
    
    // get all lists and their listUuid
    const lists = await bring.loadLists();
    
    // get items of a list by its list uuid
    const items = await bring.getItems('9b3ba561-02ad-4744-a737-c43k7e5b93ec');
    
    // get translations
    const translations = await bring.loadTranslations('de-DE');
} 
```

More important methods are `getItems(listUUID)`, `getItemsDetails(listUUID)`, `saveItem(listUuid, itemName, specificaiton)`, 
`moveToRecentList(listUuid, itemName)` and `getAllUsersFromList(listUuid)`.

## Changelog
### 1.5.1 (2022-10-31)
* (foxriver76) updated types
* (foxriver76) fixed `removeItemImage` as headers were missing

### 1.5.0 (2022-10-31)
* (Aliyss) added methods to link an image to an item (PR #221)

### 1.4.3 (2022-05-01)
* (foxriver76) fixed typos in types (thanks to @Squawnchy)

### 1.4.2 (2021-08-12)
* (foxriver76) restructure to typescript

### 1.3.1 (2021-04-29)
* (foxriver76) fixed issue where error was used instead of the mssage on `getPendingInvitations`

### 1.3.0 (2020-10-05)
* (mdhom) added `getItemsDetails` method
* (foxriver76) now reject with real errors instead of strings

### 1.2.3 (2019-09-22)
* (foxriver76) on new call of login overwrite bearer header to allow reauth

### 1.2.2
* (foxriver76) More information on rejection of getItems

### 1.2.1
* (foxriver76) minor fix

### 1.2.0
* (foxriver76) new functionalities -> getTranslations, getCatalog and getPendingInvitations

### 1.1.0
* (foxriver76) use API version v2

### 1.0.2
* (foxriver76) minor code optimization, nothing functional

### 1.0.1
* (foxriver76) fix links in package

### 1.0.0
* (foxriver76) offical release

