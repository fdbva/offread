
/*eslint-env browser, parsedInput */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

document.addEventListener("DOMContentLoaded", (event) => {
    openDb()
        .then(getListOfStoriesInDb)
        .then(updateSideBarMenu)
        .catch((reason) => {
            console.log("DOMContentLoaded catch, reason: ", reason);
        });
});
//btnScrape.addEventListener("click", StartScrap);
aboutbtn.addEventListener("click", displayScreen.bind(this, "about"));
homebtn.addEventListener("click", displayScreen.bind(this, "home"));
mobileNav.addEventListener("click", toggleSideBar.bind(this));
nextChapterLink[0].addEventListener("click", changeToNextChapter.bind(this));
previousChapterLink[0].addEventListener("click", changeToPreviousChapter.bind(this));
nextChapterLink[1].addEventListener("click", changeToNextChapter.bind(this));
previousChapterLink[1].addEventListener("click", changeToPreviousChapter.bind(this));

inputScrape.addEventListener("focus", (e) => {
    this.value = "";
}); //optionally clear on 'beforepaste'

//ScrapeButtonStarter();
btnScrape.addEventListener("click",
    () => {
        ScrapeButtonStarter()
            .then(getStoryInfo)
            .then(parseStoryInfo)
            .then(buildChapterPromises)
            .then(getFirstChapter)
            .then(getListOfStoriesInDb) //TODO: optimize,
            .then(updateSideBarMenu)    //TODO: without going to DB? Don't need to get everything again?
            .then(getAllChapters)
            .then(getListOfStoriesInDb) //TODO: only disable loader gif? still need to create/enable gif
            .then(updateSideBarMenu)    //TODO: not necessary to list and update again
            .then(populateSelectOptions)
            .catch(function(reason) {
                console.log("inside catch, reason: ", reason);
            });
    });
btnScrapeAndDrive.addEventListener("click",
    () => {
        ScrapeButtonStarter()
            .then(getStoryInfo)
            .then(parseStoryInfo)
            .then(buildChapterPromises)
            .then(getFirstChapter)
            .then(getListOfStoriesInDb) //TODO: optimize,
            .then(updateSideBarMenu)    //TODO: without going to DB? Don't need to get everything again?
            .then(getAllChapters)
            .then(getListOfStoriesInDb) //TODO: only disable loader gif? still need to create/enable gif
            .then(updateSideBarMenu)    //TODO: not necessary to list and update again
            .then(StartGoogleDrive)
            //.then(handleClientLoad)
            .then(checkAuthImmediate)//.then(function (resp) { test(resp); }))
            .then(createAppFolderAsync)
            .then(createStoryFolderAsync)
            .then(uploadAllStoryChapters)
            .then(populateSelectOptions)
            .catch(function (reason) {
                console.log("inside catch, reason: ", reason);
            });
    });

btnRestore.addEventListener("click",
    () => {
        StartGoogleDrive()
            .then(checkAuthImmediate)
            .then(createAppFolderAsync)
            .then(restoreFromGoogle)
            .catch((reason) => {
                console.log("inside catch, reason: ", reason);
            });
    });
