
/*eslint-env browser, parsedInput */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

document.addEventListener("DOMContentLoaded", function (event) {
    openDb(function () { //rever callback to promise
        updateStoryList();
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
            .then(getAllChapters)
            //.then(populateDropDownMenu) 
            .catch(function(reason) {
                console.log("inside catch, reason: ", reason);
            });
    });

