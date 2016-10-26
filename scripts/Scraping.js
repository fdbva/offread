/*eslint-env browser */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

const getFirstChapter = function(data) {
    console.log("getFirstChapter beforebegin");
    return makeRequest(data.chapterLinks[0])
        .then(function(response) {
            //console.log("getFirstChapter, response", response);
            return upsertChapter(
                    data.idStory + ".1",
                    data.parsedInput.storyName,
                    data.parsedInput.href,
                    response,
                    data.numberOfChapters
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

const getAllChapters = function(data) {
    delete data.chapterLinks[0];
    console.log("getAllChapters, data", data.chapterLinks);
    console.log("getAllChapters, inside loop, data", data);
    return data.chapterLinks.map(function(response, i) {
        return makeRequest(data.chapterLinks[i])
            .then(function(response) {
                return upsertChapter(
                        data.idStory + "." + (i + 1),
                        data.parsedInput.storyName,
                        data.parsedInput.href,
                        response,
                        data.numberOfChapters)
                    .then(function() {
                        //update sidebar, update nav
                        console.log("getAllChapters -> after save each chapter");
                        return data;
                    });
            });
    });
};

const testReturn = function(data) {
    const promise = new Promise(function(resolve, reject) {
        console.log("testReturn, data: ", data);
        resolve(data);
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

function populateChapters() {
    for (let i = 1; i <= Story.chapters; i++) {
        const url = Story.parsedInput.hrefEmptyChapter + i,
            xpath = Story.parsedInput.xpathStory;

        const nextStoryPath = Story.id + "." + i;
        makeRequest("GET", yqlStringBuilder(url, xpath, "xml"))
            .then(function(data) {
                upsertChapter(nextStoryPath,
                    Story.name,
                    Story.href,
                    data,
                    Story.chapters);
                updateStoryList();
                const obj = {
                    "storyChapterId": nextStoryPath,
                    "StoryName": Story.name,
                    "Url": Story.href,
                    "Content": data,
                    "NumberOfChapters": Story.chapters
                };
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
const getStoryInfo = function(data) {
    console.log("getStoryInfo, data:", data);
    return makeRequest(data);
};
const parseStoryInfo = function(data) {
    const promise = new Promise((resolve, reject) => {
        const numberOfChapters = (JSON.parse(data)).query.results.select[0].option.length;
        if (numberOfChapters <= 0) {
            reject();
        }
        const storyObj = {
            numberOfChapters: numberOfChapters,
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
const buildChapterPromises = function(data) {
    const promise = new Promise(function(resolve, reject) {
        for (let i = 1; i <= 3; i++) { //data.numberOfChapters; i++) {
            const yqlStringChapter = yqlStringBuilder(
                data.parsedInput.hrefEmptyChapter + i,
                data.parsedInput.xpathStory,
                "xml");
            data.chapterLinks.push({ method: "GET", url: yqlStringChapter });
        };
        console.log("buildChapterPromises, data", data);
        if (!data || !data.chapterLinks || data.chapterLinks.length <= 0) {
            reject(data);
        }
        resolve(data);
    });
    return promise;
};
