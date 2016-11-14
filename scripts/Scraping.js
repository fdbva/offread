/*eslint-env browser */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

const getFirstChapter = function(data) {
    const promise = new Promise((resolve, reject) => {
        console.log("getFirstChapter beforebegin, link: ", that.scrape.chapterLinksList[0]);
        return makeRequest(that.scrape.chapterLinksList[0])
            .then(function(response) {
                console.log("getFirstChapter makerequest.then, response: ", response != null);
                storyObj = {
                    storyChapterId: that.scrape.parsedInput.storyId + ".1",
                    storyName: that.scrape.parsedInput.storyName,
                    totalOfChapters: that.scrape.totalOfChapters,
                    chapterUrl: that.scrape.parsedInput.hrefEmptyChapter + "/1",
                    storyContent: response
                };
                that.chaptersArray.push(storyObj);
                delete that.scrape.chapterLinksList[0];
                resolve(data);
            });
    });
    return promise;
};

const getAllChapters = (data) => {
    const promise = new Promise((resolve, reject) => {
        console.log("getAllChapters, data", that.scrape.chapterLinksList);
        const k = that.scrape.chapterLinksList.length;
        let j = 0;
        return Promise.map(that.scrape.chapterLinksList, (response, i) => {
                return makeRequest(that.scrape.chapterLinksList[i])
                    .then((response) => {
                        const storyObj = {
                            storyChapterId: that.scrape.parsedInput.storyId + "." + (i + 1),
                            storyName: that.scrape.parsedInput.storyName,
                            totalOfChapters: that.scrape.totalOfChapters,
                            chapterUrl: that.scrape.parsedInput.hrefEmptyChapter + `/${i + 1}`,
                            storyContent: response
                        };
                        console.log(`requests done: ${++j}/${k}`);
                        that.chaptersArray.push(storyObj);
                    }).catch((reason)=> { console.log(reason); });
            })
            .then((resp) => {
                window.performance.mark('endGetAllChapters');
                console.groupEnd("getAllChapters");
                resolve(data);
            })
        .catch((reason)=> { console.log(reason); });
    });
    return promise;
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

//const populateChapters = function() {
//    for (let i = 1; i <= that.scrape.totalOfChapters; i++) {
//        const chapterUrl = that.scrape.parsedInput.hrefEmptyChapter + i;
//        const xpath = that.scrape.parsedInput.xpathStory;
//        const storyChapterId = that.scrape.parsedInput.storyId+`.${i}`;
//        makeRequest("GET", yqlStringBuilder(chapterUrl, xpath, "xml"))
//            .then(function(response) {
//                upsertChapter(storyChapterId,
//                    that.scrape.parsedInput.name,
//                    that.scrape.parsedInput.href,
//                    response,
//                    that.scrape.totalOfChapters);
//            })
//            .catch(function(err) {
//                console.log("Request failed", err);
//            });
//    }

//    getCurrentChapter();
//};

function parseUrl(url) {
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
    url = url.replace("/m.", "/www.");
    parseUrl(url);
    const input = that.scrape.parsedInput;
    if (!supSites.has(input.hostname)) {
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
    console.log(`Site ${input.name} successfully detected`, input);//JSON.stringify(input, undefined, 2));
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

    function ScrapeButtonStarter() {
        console.groupCollapsed("ScrapeButtonStarter");
        that.scrape.length = 0;
        const promise = new Promise((resolve, reject) => {
            parseUserInput(inputScrape.value, supportedSites);
            that.scrape.yqlGetChapterLinks = yqlStringBuilder(that.scrape.parsedInput.href,
                that.scrape.parsedInput.xpathLinks);
            if (!that.scrape.yqlGetChapterLinks) {
                console.log("StartScrapingAsync reject");
                reject();
            }
            const title = document.querySelector("#title");
            title.textContent = that.scrape.parsedInput.storyName;
            console.log("StartScrapingAsync resolve");
            console.groupEnd("ScrapeButtonStarter");
            resolve({ method: "GET", url: that.scrape.yqlGetChapterLinks });
    });
    return promise;
};
    const getStoryInfo = (data) => {
        console.groupCollapsed("getStoryInfo");
        window.performance.mark('startGetStoryInfo');
    return new Promise((resolve, reject) => {
        resolve(makeRequest(data));
    });
};
const parseStoryInfo = function (response) {
    const promise = new Promise((resolve, reject) => {
        const totalOfChapters = (JSON.parse(response)).query.results.select[0].option.length;
        if (totalOfChapters <= 0) {
            reject();
        }
        that.scrape.totalOfChapters = totalOfChapters;
        that.scrape.currentChapter = 1;
        const storyObj = {
            totalOfChapters: totalOfChapters,
            data: response,
            parsedInput: that.scrape.parsedInput,
            currentChapter: 1,
            idStory: that.scrape.parsedInput.storyId,
            href: that.scrape.parsedInput.href,
            chapterLinks: []
        };
        console.log("parseStoryInfo, storyObj", storyObj); //, data);
        console.groupEnd("getStoryInfo");
        window.performance.mark('endGetStoryInfo');
        resolve(storyObj);
    });
    return promise;
};
const buildChapterPromises = function () {
    console.groupCollapsed("getAllChapters");
    window.performance.mark('startGetAllChapters');
    const promise = new Promise(function(resolve, reject) {
        that.scrape.chapterLinksList.length = 0;
        for (let i = 1; i <= that.scrape.totalOfChapters; i++) {
            const yqlGetChapter = yqlStringBuilder(
                that.scrape.parsedInput.hrefEmptyChapter + i,
                that.scrape.parsedInput.xpathStory,
                "xml");
            that.scrape.chapterLinksList.push({ method: "GET", url: yqlGetChapter });
        };
        console.log("buildChapterPromises, that.scrape.chapterLinksList", that.scrape.chapterLinksList);
        if (!that.scrape || !that.scrape.chapterLinksList || that.scrape.chapterLinksList.length <= 0) {
            reject();
        }
        resolve();
    });
    return promise;
};
