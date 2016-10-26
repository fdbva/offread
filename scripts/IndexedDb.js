/*eslint-env browser */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

function openDb(fn) {
    console.log("openDb ...");
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
        // Better use "this" than "req" to get the result to avoid problems with
        // garbage collection.
        // db = req.result;
        db = this.result;
        console.log("openDb DONE");
        fn();
    };
    req.onerror = function (evt) {
        console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
        console.log("openDb.onupgradeneeded");
        const store = evt.currentTarget.result.createObjectStore(
          DB_STORE_NAME, { keyPath: "storyChapterId", autoIncrement: true });

        store.createIndex("storyChapterId", "storyChapterId", { unique: true });
        store.createIndex("AuthorName", "AuthorName", { unique: false });
        //store.createIndex("StoryName", "StoryName", { unique: false });
        //store.createIndex("ChapterNumber", "ChapterNumber", { unique: false });
    };
}

/**
* @param {string} storeName
* @param {string} mode either "readonly" or "readwrite"
*/
function getObjectStore(storeName, mode) {
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
}

function clearObjectStore() {
    const store = getObjectStore(DB_STORE_NAME, "readwrite");
    const req = store.clear();
    req.onsuccess = function (evt) {
        displayActionSuccess("Store cleared");
        displayStoryList(store);
    };
    req.onerror = function (evt) {
        console.error("clearObjectStore:", evt.target.errorCode);
        displayActionFailure(this.error);
    };
}

//rever de callback para promise
function getChapter(storyChapterId) {
    const request = db.transaction(DB_STORE_NAME).objectStore(DB_STORE_NAME).get(storyChapterId);
    request.onerror = function (event) {
        console.log("GetChapterError: ", request.error);
    };
    request.onsuccess = function (event) {
        if (request.result) {
            const value = event.target.result;
            console.log(value.Content.slice(0, 300));
            storyList.innerHTML = `<div class="chapterBox">${value.Content}</div>`;
        }
    };
}

//rever de callback para promise
function populateStoryArray(onCompleteCallbackFunction) {
    const transaction = db.transaction(DB_STORE_NAME);
    const objectStore = transaction.objectStore(DB_STORE_NAME);
    const myArray = [];
    const storySet = new Set();
    const request = objectStore.openCursor();
    request.onsuccess = function () {
        const cursor = this.result;
        if (!cursor) return;
        if (!storySet.has(cursor.value.StoryName)) {
            myArray.push(cursor.value);
            storySet.add(cursor.value.StoryName);
        }
        cursor.continue();
    };
    transaction.oncomplete = function () {
        onCompleteCallbackFunction(myArray);
    };
}

/**
* @param {string} storyChapterId
* @param {string} storyName
* @param {string} url
* @param {json object} content
* @param {string} numberOfChapters
*/
function upsertChapter(storyChapterId, storyName, url, content, numberOfChapters) {
    const obj = {
        "storyChapterId": storyChapterId,
        "StoryName": storyName,
        "Url": url,
        "Content": content,
        "NumberOfChapters": numberOfChapters
    };

    const store = getObjectStore(DB_STORE_NAME, "readwrite");
    let req;
    try {
        req = store.put(obj);
    } catch (e) {
        if (e.name == "DataCloneError")
            displayActionFailure("This engine doesn't know how to clone a Blob, " +
                                 "use Firefox");
        throw e;
    }
    req.onsuccess = function (evt) {
        console.log("Insertion in DB successful");
    };
    req.onerror = function () {
        console.error("addStory error", this.error);
    };
}

/**
* @param {string} storyChapterId
*/
function deleteChapter(storyChapterId) {
    console.log("deletePublication:", arguments);
    const store = getObjectStore(DB_STORE_NAME, "readwrite");
    const req = store.index("storyChapterId");
    req.get(storyChapterId).onsuccess = function (evt) {
        if (typeof evt.target.result == "undefined") {
            // displayActionFailure("No matching record found");
            return;
        }
        deleteMethod(evt.target.result.storyChapterId, store);
    };
    req.onerror = function (evt) {
        console.error("deleteChapter:", evt.target.errorCode);
    };
}

/**
* @param {number} key
* @param {IDBObjectStore=} store
*/
function deleteMethod(key, store) {
    console.log("deleteMethod:", arguments);

    if (typeof store == "undefined")
        store = getObjectStore(DB_STORE_NAME, "readwrite");

    // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
    // the result of the Object Store Deletion Operation algorithm is
    // undefined, so it's not possible to know if some records were actually
    // deleted by looking at the request result.
    let req = store.get(key);
    req.onsuccess = function (evt) {
        const record = evt.target.result;
        console.log("record:", record);
        if (typeof record == "undefined") {
            // displayActionFailure("No matching record found");
            return;
        }
        // Warning: The exact same key used for creation needs to be passed for
        // the deletion. If the key was a Number for creation, then it needs to
        // be a Number for deletion.
        req = store.delete(key);
        req.onsuccess = function (evt) {
            console.log("evt:", evt);
            console.log("evt.target:", evt.target);
            console.log("evt.target.result:", evt.target.result);
            console.log("delete successful");
        };
        req.onerror = function (evt) {
            console.error("deleteMethod:", evt.target.errorCode);
        };
    };
    req.onerror = function (evt) {
        console.error("deleteMethod:", evt.target.errorCode);
    };
}

