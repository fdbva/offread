/*eslint-env browser */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/


const StartGoogleDrive = function () {
    const promise = new Promise(function (resolve, reject) {
        console.log("StartGoogleDrive started");
        var script = document.createElement('script'),
            loaded;
        script.setAttribute('src', "https://apis.google.com/js/client.js");
        
        script.onreadystatechange = script.onload = function () {
            if (!loaded) {
                setTimeout(function() { resolve(); }, 500);
            };
            loaded = true;
        };
        document.getElementsByTagName('head')[0].appendChild(script);
        //JS.load("https://apis.google.com/js/client.js", function () {
        //    //Do your thing.
        //    console.log("onreadystate");
        //    resolve(setTimeout(function() {
        //        gapi.auth.authorize(
        //                { 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true },
        //                handleAuthResult)
        //            .then(console.log("checkAuth"));
        //    }, 500));
                
        //});
        //var script = document.createElement('script');
        //script.src = "https://apis.google.com/js/client.js";

        //script.addEventListener('load', function () {
        //    resolve(script);
        //}, false);
        //script.onreadystatechange = script.onload = function () {
        //    console.log("onreadystate");
        //    gapi.auth.authorize(
        //{ 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true },
        //handleAuthResult).then(alert("checkAuth"));
        //    console.log("after onreadystate");
        //    }

        //script.addEventListener('error', function () {
        //    reject(script);
        //    console.log('StartGoogleDrive rejected');
        //}, false);

        //document.body.appendChild(script);
    });
    return promise;
};
//var JS = {
//    load: function (src, callback) {
//        var script = document.createElement('script'),
//            loaded;
//        script.setAttribute('src', src);
//        if (callback) {
//            script.onreadystatechange = script.onload = function () {
//                if (!loaded) {
//                    callback();
//                }
//                loaded = true;
//            };
//        }
//        document.getElementsByTagName('head')[0].appendChild(script);
//    }
//};

/**
 * Called when the client library is loaded to start the auth w.
 */
//function handleClientLoad() {
//    const promise = new Promise(function(resolve, reject) {
//        console.log("handleClientLoad");
//        window.setTimeout(resolve(checkAuth), 1);
//    });
//    return promise;
//}
/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
    return Promise.resolve(gapi.auth.authorize(
            { 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true })
        .then(function(response) {
            console.log("checkAuth");
            handleAuthResult(response);
        }));
};

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    const promise = new Promise(function(resolve, reject) {
        const authButton = document.getElementById("authorizeButton");
        authButton.style.display = "none";
        if (authResult && !authResult.error) {
            // Access token has been successfully retrieved, requests can be sent to the API.
            console.log("authResult success");
            authButton.style.display = "none";
            return gapi.client.load("drive", "v2").then(function(response) { return resolve(response); }, function (reason) { return reject(reason); });
                //,
                //function() {
                //    gapi.client.drive.files.list(
                //            { 'q': "mimeType = 'application/vnd.google-apps.folder'" })
                //        .then(function (resp) {
                //            console.log("gapi.client.drive.files.list then, resp: ", resp);
                //            resolve(resp.result.items);
                //        });
                //});//.then(function(reason) { console.log("handleAuthResult reason", reason); return setTimeout(resolve(), 1000) }, function (reason) { return reject(reason) });
        } else {
            // No access token could be retrieved, show the button to start the authorization flow.
            console.log("authResult need authorization click");
            authButton.style.display = "block";
            authButton.onclick = function() {
                return gapi.auth.authorize(
                    { 'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false }).then(function (response) { return resolve(response); }, function (reason) { return reject(reason); });;
            };
        }
    });
    return promise;
}
/**
 * Start the file upload.
 *
 * @param {Object} evt Arguments from the file selector.
 */
function uploadFile(evt) {
    const promise = new Promise(function(resolve, reject) {
        gapi.client.load("drive",
            "v2",
            function () {
                resolve();
                //listFiles("OffWebReader", "TesteMagico.2", appState);

                //listFilesFolder("OffWebReader", id, null);           
                //setTimeout(function(){ listFiles(storyName, "TesteMagico.4", appState); }, 4000);
                //setTimeout(function(){ deleteFile(idStory); }, 7000);                        
            },
            function() {
                reject();
            });
    });
    return promise;
}
/**
 * Insert new file.
 */
function createAppFolder() {
    listFiles("OffWebReader", null, createAppFolderHelper);
}

function createStoryFolder(storyName) {
    if (!storyName) {
        console.log("createStoryFolder !storyName", storyName);
        return;
    }
    if (!globalAppFolderGoogleId) {
        console.log("createStoryFolder !appFolderGoogleId", appFolderGoogleId);
        return;
    }
    listFiles(storyName, globalAppFolderGoogleId, createStoryFolderHelper);
}

function deleteStoryFolder(storyName) {
    if (!storyName) {
        console.log("deleteStoryFolder !storyName", storyName);
        return;
    }
    if (!globalAppFolderGoogleId) {
        console.log("deleteStoryFolder !globalAppFolderGoogleId", globalAppFolderGoogleId);
        return;
    }
    listFiles(storyName, globalAppFolderGoogleId, deleteStoryFolderHelper);
}

function folderAddOrUpdate(files, name) {
    if (!files) {
        console.log("folderAddOrUpdate !files", files);
        return;
    }
    if (!name) {
        console.log("folderAddOrUpdate !name", name);
        return;
    }
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        //console.log(id+" / "+title);                
        if (file.title === name) {
            if (globalAppFolderGoogleId === null) {
                globalAppFolderGoogleId = file.id;
            }
            else {
                globalStoryFolderGoogleId = file.id;
                const request = gapi.client.drive.files.delete({
                    'fileId': globalStoryFolderGoogleId
                });
                request.execute(function (resp) { });
            }
            console.log(`folder${name} existe`);
            return true;
        }
    }
    return false;
}

function createAppFolderHelper(files, name, parent) {
    if (!name) {
        console.log("createAppFolderHelper !name", name);
        return;
    }
    if (folderAddOrUpdate(files, name)) {
        return;
    }
    const data = new Object();
    data.title = name;
    data.mimeType = "application/vnd.google-apps.folder";
    gapi.client.drive.files.insert({ 'resource': data }).execute(function (fileList) {
        globalAppFolderGoogleId = fileList.id;
        console.log(fileList);
    });
    console.log("appFolder: " + name + " criado");
}

function createStoryFolderHelper(files, storyName, parent) {
    if (folderAddOrUpdate(files, storyName)) {
        if (!globalStoryFolderGoogleId) {
            console.log("globalStoryFolderGoogleId não encontrado", globalStoryFolderGoogleId);
            return;
        }
    }
    if (!globalAppFolderGoogleId) {
        console.log("globalAppFolderGoogleId não encontrado", globalAppFolderGoogleId);
        return;
    }
    const data = new Object();
    data.title = storyName;
    data.parents = [{ "id": globalAppFolderGoogleId }];
    data.mimeType = "application/vnd.google-apps.folder";
    gapi.client.drive.files.insert({ 'resource': data }).execute(function (fileList) {
        console.log("createStoryFolderHelper execute", fileList.id);
        globalStoryFolderGoogleId = fileList.id;
        console.log(fileList);
        populateChapters();
    });
    console.log("storyFolder: " + name + " criado");
}

function deleteStoryFolderHelper(files, storyName, ignore2) {
    if (!globalStoryFolderGoogleId) {
        console.log("deleteStoryFolderHelper !storyFolderGoogleId", storyFolderGoogleId);
    }
    folderAddOrUpdate(files, storyName);
}

function uploadChapter(chapterObject, storyFolderGoogleId) {
    if (!chapterObject) {
        console.log("uploadChapterHelper !chapterObject", chapterObject);
    }
    if (!storyFolderGoogleId) {
        console.log("uploadChapterHelper !storyFolderGoogleId", storyFolderGoogleId);
    }
    const boundary = "-------314159265358979323846264";
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    const contentType = "application/json";
    const metadata = {
        'title': chapterObject.storyChapterId,
        'mimeType': contentType,
        "parents": [{ "id": storyFolderGoogleId }]
    };
    const obj = (JSON.stringify(chapterObject));
    const multipartRequestBody =
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: " + contentType + "\r\n\r\n" +
        obj +
        close_delim;
    const request = gapi.client.request({
        'path': "/upload/drive/v2/files",
        'method': "POST",
        'params': { 'uploadType': "multipart" },
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });
    request.execute(function (arg) {
        console.log("uploadChapterHelper, arg: ", arg);
    });
}

function listFiles(folderName, parent, callback) {
    if (!folderName) {
        console.log("listFiles !folderName", folderName);
    }
    if (!parent) {
        console.log("listFiles !parent", parent);
    }
    if (!callback) {
        console.log("listFiles !callback", callback);
    }
    var request = gapi.client.drive.files.list(
      { 'q': "mimeType = 'application/vnd.google-apps.folder'" });
    request.execute(function (resp) {
        var files = resp.items;
        if (files && files.length > 0) {
            callback(files, folderName, parent);
        }
        else {
            callback(null, "OffWebReader", undefined);
        }
    });
}

function listFilesAsync(resp) {
        
        return gapi.client.drive.files.list(
                { 'q': "mimeType = 'application/vnd.google-apps.folder'" })
            .then(function(response) {
                Promise.resolve(response.items);
            }, function (reason) { Promise.reject(reason); });
};