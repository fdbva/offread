
/*eslint-env browser, parsedInput */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

document.addEventListener("DOMContentLoaded", function (event) {
    openDb()
        .then(getListOfStoriesInDb)
        .then(updateSideBarMenu)
        .catch(function(reason) {
            console.log("DOMContentLoaded catch, reason: ", reason);
        });
});
//btnScrape.addEventListener("click", StartScrap);
aboutbtn.addEventListener("click", displayScreen.bind(this, "about"));
homebtn.addEventListener("click", displayScreen.bind(this, "home"));
mobileNav.addEventListener("click", toggleSideBar.bind(this));
nextChapterLink.addEventListener("click", changeToNextChapter.bind(this));
previousChapterLink.addEventListener("click", changeToPreviousChapter.bind(this));

inputScrape.addEventListener("focus", function (e) {
    this.value = "";
}); //optionally clear on 'beforepaste'

//ScrapeButtonStarter();
btnScrape.addEventListener("click",
    function() {
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
            //.then(populateDropDownMenu) 
            .catch(function(reason) {
                console.log("inside catch, reason: ", reason);
            });
    });
btnScrapeAndDrive.addEventListener("click",
    function () {
        ScrapeButtonStarter()
            //.then(getStoryInfo)
            //.then(parseStoryInfo)
            //.then(buildChapterPromises)
            //.then(getFirstChapter)
            //.then(getListOfStoriesInDb) //TODO: optimize,
            //.then(updateSideBarMenu)    //TODO: without going to DB? Don't need to get everything again?
            //.then(getAllChapters)
            //.then(getListOfStoriesInDb) //TODO: only disable loader gif? still need to create/enable gif
            //.then(updateSideBarMenu)    //TODO: not necessary to list and update again
            .then(StartGoogleDrive)
            //.then(handleClientLoad)
            .then(checkAuth)
            .then(listFilesAsync)
            //.then(handleAuthResult)
            //.then(populateDropDownMenu) 
            .catch(function (reason) {
                console.log("inside catch, reason: ", reason);
            });
    });
