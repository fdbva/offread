
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

btnScrape.addEventListener("click",
    ScrapeButtonStarter
        .then(getStoryInfo)
        //.then(parseStoryInfo)
        //.then(buildChapterPromises)
        //.then(getFirstChapter)
        //.then(getAllChapters)
        // .then(testReturn)
        // .then(populateDropDownMenu)
);

const populateDropDownMenu = function (data) {
    const promise = new Promise(function (resolve, reject) {
        console.log("populateDropDownMenu, data:", data);
        for (let i = 1; i <= Story.chapters; i++) {
            const opt = document.createElement("option");
            opt.value = i;
            opt.innerHTML = "Chapter: " + i;
            chaptersSelect.appendChild(opt);
        };
        chaptersSelect.addEventListener("change", function () {
            goToChapter(this.value);
        });
        resolve();
    });
    return promise;
};

