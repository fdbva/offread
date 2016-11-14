
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
        })
    .then(() => { console.groupEnd("pageStart") });
});
//btnScrape.addEventListener("click", StartScrap);
aboutbtn.addEventListener("click", displayScreen.bind(this, "about"));
homebtn.addEventListener("click", displayScreen.bind(this, "home"));
mobileNav.addEventListener("click", toggleSideBar.bind(this));
nextChapterLink.addEventListener("click", changeToNextChapter.bind(this));
previousChapterLink.addEventListener("click", changeToPreviousChapter.bind(this));

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
            .then(updateSideBarMenu) //TODO: without going to DB? Don't need to get everything again?
            .then(getAllChapters)
            .then(getListOfStoriesInDb) //TODO: only disable loader gif? still need to create/enable gif
            .then(updateSideBarMenu) //TODO: not necessary to list and update again
            //.then(populateDropDownMenu) 
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
            //.then(getFirstChapter)
            //.then(getListOfStoriesInDb) //TODO: optimize,
            //.then(updateSideBarMenu)    //TODO: without going to DB? Don't need to get everything again?
            .then(getAllChapters)
            .then(upsertAllChaptersFromArray)
            .then(getListOfStoriesInDb) //TODO: only disable loader gif? still need to create/enable gif
            .then(updateSideBarMenu)    //TODO: not necessary to list and update again
            .then(StartGoogleDrive)
            ////.then(handleClientLoad)
            .then(forceAuthGoogleDrive)//.then(function (resp) { test(resp); }))
            .then(createAppFolderAsync)
            .then(uploadStory)
            //.then(createStoryFolderAsync)
            //.then(uploadAllStoryChapters)
            //.then(populateDropDownMenu) 
            .catch(function (reason) {
                console.log("inside catch, reason: ", reason);
            })
        .then(reportPerformance);
    });
const reportPerformance = () =>
{
    console.groupCollapsed("Reporting...");
    window.performance.measure('deflatePerformance', 'startStringifyPakoDeflateStory', 'endStringifyPakoDeflateStory');
    window.performance.measure('getStoryInfo', 'startGetStoryInfo', 'endGetStoryInfo');
    window.performance.measure('getAllChapters', 'startGetAllChapters', 'endGetAllChapters');
    window.performance.measure('uploadStory', 'startUploadStory', 'endUploadStory');
    const getStoryInfoPerformance = window.performance.getEntriesByName('getStoryInfo');
    const getAllChaptersPerformance = window.performance.getEntriesByName('getAllChapters');
    const deflatePerformance = window.performance.getEntriesByName('deflatePerformance');
    const uploadStoryPerformance = window.performance.getEntriesByName('uploadStory');
    console.log("getStoryInfoPerformance: ", getStoryInfoPerformance[0].PerformanceMeasure.duration);
    console.log("getAllChaptersPerformance: ", getAllChaptersPerformance[0].PerformanceMeasure.duration);
    console.log("deflatePERFORMANCE: ", deflatePerformance[0].PerformanceMeasure.duration);
    console.log("uploadStoryPerformance: ", uploadStoryPerformance[0].PerformanceMeasure.duration);
    console.groupEnd("Reporting...");
}
btnRestore.addEventListener("click",
    () => {
        StartGoogleDrive()
            .then(forceAuthGoogleDrive)
            .then(createAppFolderAsync)
            .then(restoreFromGoogle)
            .catch((reason) => {
                console.log("inside catch, reason: ", reason);
            });
    });
