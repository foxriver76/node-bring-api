# Node-Bring-Shopping
[![NPM version](http://img.shields.io/npm/v/bring-shopping.svg)](https://www.npmjs.com/package/bring-shopping)
[![Downloads](https://img.shields.io/npm/dm/bring-shopping.svg)](https://www.npmjs.com/package/bring-shopping)
[![Build Status](https://travis-ci.org/foxriver76/node-bring-api.svg?branch=master)](https://travis-ci.org/foxriver76/node-bring-api) [![Greenkeeper badge](https://badges.greenkeeper.io/foxriver76/node-bring-api.svg)](https://greenkeeper.io/)


A node module for Bring! shopping lists.

## Installation
```npm install bring-shopping --production```

## Usage Example

```javascript
const bringApi = require(`bring-shopping`);

main()

async function main () {
    // provide user and email to login
    const bring = new bringApi({mail: `example@example.com`, password: `secret`});
    
    // login to get your uuid and Bearer token
    await bring.login();
    
    // get all lists and their listUuid
    const lists = await bring.loadLists();
    
    // get items of a list by its list uuid
    const items = await bring.getItems('9b3ba561-02ad-4744-a737-c43k7e5b93ec');
    
    // get translations
    const translations = await bring.loadTranslations('de-DE');
} 
```

More important methods are `getItems(listUUID)`, `saveItem(listUuid, itemName, specificaiton)`, 
`moveToRecentList(listUuid, itemName)` and `getAllUsersFromList(listUuid)`.

## Changelog

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

