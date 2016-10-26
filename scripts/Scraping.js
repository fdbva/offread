/*eslint-env browser */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

function getFirstChapter(data) {
    console.log("getFirstChapter beforebegin");
    return makeRequest(that.scrape.chapterLinksList[0])
        .then(function(response) {
            //console.log("getFirstChapter, response", response);
            return upsertChapter(
                    that.scrape.parsedInput.storyId + ".1",
                    that.scrape.parsedInput.storyName,
                    that.scrape.parsedInput.hrefEmptyChapter+"/1",
                    response,
                    that.scrape.totalOfChapters
                )
                .then(function() {
                    // data.chapterLinks.shift();
                    // data.chapterLinks = data.chapterLinks;
                    //console.log("getFirstChapter, response", response);
                    //update sidebar, update nav
                    console.log("adadsa", data);
                    return data;
                });
        });
};

function getAllChapters(data) {
    delete that.scrape.chapterLinksList[0];
    console.log("getAllChapters, data", that.scrape.chapterLinksList);
    console.log("getAllChapters, inside loop, data", data);
    return that.scrape.chapterLinksList.map(function(response, i) {
        return makeRequest(that.scrape.chapterLinksList[i])
            .then(function(response) {
                return upsertChapter(
                        that.scrape.parsedInput.storyId + "." + (i + 1),
                        that.scrape.parsedInput.storyName,
                        that.scrape.parsedInput.hrefEmptyChapter+`/${i+1}`,
                        response,
                        that.scrape.totalOfChapters)
                    .then(function() {
                        //update sidebar, update nav
                        console.log("getAllChapters -> after save each chapter");
                        return data;
                    });
            });
    });
};

//function StartScrap(e) {
//    const parsedInput = parseUserInput(inputScrape.value, supportedSites);
//    const yqlStringLinks = yqlStringBuilder(parsedInput.href, parsedInput.xpathLinks);
//    const yqlStringChapters = new Set();
//    console.log(parsedInput);
//    const title = document.querySelector("#title");

//    Story.name = parsedInput.storyName;
//    title.textContent = Story.name;
//    makeRequest("GET", yqlStringLinks).then(function(data)
//    {
//        const numberOfChapters = (JSON.parse(data)).query.results.select[0].option.length;
//        chaptersTotal.textContent = numberOfChapters;

//        Story.chapters = numberOfChapters;
//        Story.data = data;
//        Story.parsedInput = parsedInput;
//        Story.currentChapter = 1;
//        Story.id = parsedInput.storyId;
//        Story.href = parsedInput.href;

//        populateChaptersSelectOptions();
//        populateChapters();
//        // createStoryFolder(parsedInput.storyId);

//    }).catch(function(err) {
//        console.log("Request failed", err);
//    });
//};

function populateChapters() {
    for (let i = 1; i <= that.scrape.totalOfChapters; i++) {
        const chapterUrl = that.scrape.parsedInput.hrefEmptyChapter + i;
        const xpath = that.scrape.parsedInput.xpathStory;
        const storyChapterId = that.scrape.parsedInput.storyId+`.${i}`;
        makeRequest("GET", yqlStringBuilder(chapterUrl, xpath, "xml"))
            .then(function(response) {
                upsertChapter(storyChapterId,
                    that.scrape.parsedInput.name,
                    that.scrape.parsedInput.href,
                    response,
                    that.scrape.totalOfChapters);
                //TODO: Raphael, vai percorrer o banco inteiro a cada capitulo adicionado?
                updateStoryList();
            })
            .catch(function(err) {
                console.log("Request failed", err);
            });
    }

    getCurrentChapter();
};

function parseUrl(url){
    const a = document.createElement("a");
    a.href = url;
    const hostArrDot = a.host.split(".");
    const hrefArrSlash = a.href.split("/");
    if (!hostArrDot[0] || !hostArrDot[1]) {
        console.log(`There's a problem in the story link`);
    }
    if (!hrefArrSlash[4]) {
        console.log(`Story ID could not be parsed from link`);
    }
    that.scrape.parsedInput = {
        origin: a.origin,
        host: a.host,
        href: a.href,
        hostname: a.hostname,
        pathname: a.pathname,
        port: a.port,
        protocol: a.protocol,
        search: a.search,
        hash: a.hash,
        xpathLinks: "",
        xpathStory: "",
        name: hostArrDot[0] == "www" || hostArrDot[0] == "m" ? hostArrDot[1] : hostArrDot[0],
        hrefEmptyChapter: a.origin + `/s/${hrefArrSlash[4]}/`,
        storyId: hrefArrSlash[4],
        storyName: hrefArrSlash[6]
    };
};

function parseUserInput(url, supSites) {
    if (!url) {
        console.log(`Couldn't find url to be parsed`);
        return;
    }
    parseUrl(url);
    const input = that.scrape.parsedInput;
    if (!supSites.has(that.hostname)) {
        console.log(`I'm sorry, '${input.value}' not found in our supported sites list`);
        return;
    }
    input.xpathLinks = supSites.get(input.hostname).xpathLinks;
    input.xpathStory = supSites.get(input.hostname).xpathStory;
    if (!input.xpathLinks || !input.xpathStory) {
        console.log(`parseUserInput input problem:
                  xpathLinks: ${input.xpathLinks}
                  xpathStory: ${input.xpathStory}`);
        return;
    }
    console.log(`Site ${input.name} successfully detected`);
    console.log(JSON.stringify(input, undefined, 2));
    return input;
};

function yqlStringBuilder(parsedUrl, xpath, format = "json") {
    if (!parsedUrl || !xpath) {
        console.log(`yqlStringBuilder input problem:
                      parsedUrl: ${parsedUrl}
                      xpath: ${xpath}`);
        return;
    }
    const yql = "https://query.yahooapis.com/v1/public/yql?" + "q=" + encodeURIComponent(`select * from html where url=@url and xpath='${xpath}'`) + "&url=" + encodeURIComponent(parsedUrl) + `&crossProduct=optimized&format=${format}`;
    return yql;
};

    const ScrapeButtonStarter = new Promise((resolve, reject) => {
        console.log("INSIDE");
    resolve();
});

    //const ScrapeButtonStarter2 = new Promise((resolve, reject) => {

const ScrapeButtonStarter2 = function() {
    return new Promise((resolve, reject) => {
        parseUserInput(inputScrape.value, supportedSites);
        that.scrape.yqlGetChapterLinks = yqlStringBuilder(that.scrape.parsedInput.href,
            that.scrape.parsedInput.xpathLinks);
        if (!that.scrape.yqlAllChapterLinks) {
            console.log("StartScrapingAsync reject");
            reject();
        }
        const title = document.querySelector("#title");
        title.textContent = that.scrape.parsedInput.storyName;
        console.log("StartScrapingAsync resolve");
        resolve({ method: "GET", url: that.scrape.yqlAllChapterLinks });
    });
};
function getStoryInfo(data) {
    console.log("AAAAA");
    if (!data) return;
    console.log("getStoryInfo, data:", data);
    return makeRequest(data);
};
function parseStoryInfo(response) {
    const promise = new Promise((resolve, reject) => {
        const totalOfChapters = (JSON.parse(response)).query.results.select[0].option.length;
        if (totalOfChapters <= 0) {
            reject();
        }
        that.scrape.totalOfChapters = totalOfChapters;
        that.scrape.currentChapter = 1;
        const storyObj = {
            numberOfChapters: totalOfChapters,
            data: data,
            parsedInput: parsedInput,
            currentChapter: 1,
            idStory: parsedInput.storyId,
            href: parsedInput.href,
            chapterLinks: []
        };
        console.log("parseStoryInfo, data"); //, data);
        resolve(storyObj);
    });
    return promise;
};
function buildChapterPromises(data) {
    const promise = new Promise(function(resolve, reject) {
        for (let i = 1; i <= 3; i++) { //data.numberOfChapters; i++) {
            const yqlGetChapter = yqlStringBuilder(
                that.scrape.parsedInput.hrefEmptyChapter + i,
                that.scrape.parsedInput.xpathStory,
                "xml");
            that.scrape.chapterLinksList.push({ method: "GET", url: yqlGetChapter });
        };
        console.log("buildChapterPromises, data", data);
        if (!that.scrape || !that.scrape.chapterLinksList || that.scrape.chapterLinks.length <= 0) {
            reject(data);
        }
        resolve(data);
    });
    return promise;
};
