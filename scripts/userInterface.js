/*eslint-env browser */
/*eslint no-var: "error"*/
/*eslint prefer-const: "error"*/
/*eslint-env es6*/

function displayScreen(currentDisplay) {
    const offreader = document.querySelector(".offreader");
    const home = document.querySelector(".home");
    const about = document.querySelector(".about");
    offreader.style.display = "none";
    home.style.display = "none";
    about.style.display = "none";

    if (currentDisplay === "about")
        about.style.display = "block";
    else if (currentDisplay === "home")
        home.style.display = "block";
    else
        offreader.style.display = "block";
}

function toggleSideBar() {
    const sidebar = document.querySelector(".sidebar");
    const navToggle = document.querySelector(".nav-toggle");

    navToggle.classList.toggle("active");
    const style = window.getComputedStyle(sidebar);
    sidebar.style.display = style.display === "none" ? "block" : "none";
}

function populateSelectOptions() {
    const promise = new Promise(function (resolve, reject) {
        console.log(Story)
        for (var i = chaptersSelect.length - 1; i >= 0; i--) {
            chaptersSelect[i].innerHTML = "";
            const optionHtml = document.createDocumentFragment();
            for (let i = 1; i <= Story.chapters; i++) {
                optionHtml.appendChild(new Option(`Chapter: ${i}`, i));
            }
            chaptersSelect[i].appendChild(optionHtml);
            chaptersSelect[i].addEventListener("change", function () {
                goToChapter(this.value);
            });
        }
    });
    return promise;
}

function closeMobileSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const navToggle = document.querySelector(".nav-toggle");

    if (navToggle.classList.contains("active")) {
        navToggle.classList.remove("active");
        sidebar.style.display = "none";
    }
}

function goToChapter(chapter) {
    Story.currentChapter = chapter;
    updateNav();
    populateSelectOptions().then(function() {
        getCurrentChapter();
    });
}

function getCurrentChapter() {
    const nextStoryPath = Story.id + "." + Story.currentChapter;
    getChapter(nextStoryPath);
}

function changeToNextChapter(e) {
    const next = document.querySelector(".next");
    if (next.classList.contains("disable"))
        return;

    Story.currentChapter += 1;
    getCurrentChapter();
    updateNav();
    e.preventDefault();
}

function changeToPreviousChapter(e) {
    const prev = document.querySelector(".prev");
    if (prev.classList.contains("disable"))
        return;

    if (Story.currentChapter > 1) {
        Story.currentChapter -= 1;
        getCurrentChapter();
        updateNav();
    }
    e.preventDefault();
}

function updateNav() {
    for (var i = chaptersSelect.length - 1; i >= 0; i--) {
        chaptersSelect[i].selectedIndex = Story.currentChapter - 1;
    }

    if (Story.currentChapter > 1) {
        previousChapterLink[0].classList.remove("disable");
        previousChapterLink[1].classList.remove("disable");

        if (Story.currentChapter == Story.chapters) {
            nextChapterLink[0].classList.add("disable");
            nextChapterLink[1].classList.add("disable");
        } else {
            nextChapterLink[0].classList.remove("disable");
            nextChapterLink[1].classList.remove("disable");
        }
    } else if (Story.currentChapter === 1) {
        previousChapterLink[0].classList.add("disable");
        previousChapterLink[1].classList.add("disable");
        if (Story.chapters > 1) {
            nextChapterLink[0].classList.remove("disable");
            nextChapterLink[1].classList.remove("disable");
        }
    }
}

function updateSideBarMenu() {
    const promise = new Promise((resolve, reject) => {
        var data = that.sidebarMenu;
        const strList = document.querySelector(".sidebar-list");
        strList.innerHTML = "";
        data.forEach(function(obj, i) {
            strList.insertAdjacentHTML("beforeend",
                `
        <a href="#" class="sidebar-list--item story-sel" data-story="${i}" title="${obj.StoryName}">
            <span class="sidebar-list--text">${obj.StoryName} - ${obj.TotalOfChapters} chapters</span>
        </a>`);
        });

        const storySelector = document.querySelectorAll(".story-sel");
        for (let i = storySelector.length - 1; i >= 0; i--) {
            storySelector[i].addEventListener("click",
                function(e) {
                    console.log(this.dataset.story);
                    const s = this.dataset.story;
                    console.log(data[s]);
                    Story.chapters = that.chaptersArray.length;
                    Story.name = data[s].StoryName;
                    Story.id = data[s].storyChapterId.split(".")[0];
                    chaptersTotal.textContent = Story.chapters;
                    title.textContent = Story.name;
                    Story.currentChapter = 1;

                    closeMobileSidebar();
                    getCurrentChapter();
                    updateNav();
                    populateSelectOptions();
                    displayScreen();
                });
        };
        resolve();
    });
    return promise;
}