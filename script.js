function introNext() {
    document.getElementById("intro" + IntroI).style.animation = "ease-out slideout 2s";
    setTimeout(function () { document.getElementById("intro" + (IntroI - 1)).style.display = "none" }, 2000);
    document.getElementById("intro" + (IntroI + 1)).style.display = "flex";
    document.getElementById("intro" + (IntroI + 1)).style.animation = "ease-out slidein 2s";
    IntroI = IntroI + 1;
}
function introEnd() {
    document.getElementById("intro" + IntroI).style.animation = "ease-out slideout 2s";
    localStorage.setItem("completedIntro", "true");
    localStorage.setItem("GoalName", document.getElementById("nameinput").value);
    localStorage.setItem("GoalDays", new Number(document.getElementById("daysinput").value));
    localStorage.setItem("DaysComplete", 0);
    localStorage.setItem("FailedDays", JSON.stringify({ "contentvalue": [] }));
    setTimeout(function () {
        document.getElementById("intro" + (IntroI)).style.display = "none";
        showItems();
    }, 2000);
}
function completeDay(positiveboolean) {
    var child = document.getElementById("boxes").children[new Number(localStorage.getItem("DaysComplete"))];
    if (positiveboolean) {
        child.classList.add("complete");
    } else {
        child.classList.add("failed");
        FailedDays = JSON.parse(localStorage.getItem("FailedDays")).contentvalue;
        FailedDays.push(child.textContent);
        localStorage.setItem("FailedDays", JSON.stringify({ "contentvalue": FailedDays }));
    }
    localStorage.setItem("DaysComplete", child.textContent);
    localStorage.setItem("LastCompletedDate", cDate());
    if (localStorage.getItem("DaysComplete") != localStorage.getItem("GoalDays")) {
        child.nextSibling.classList.add("waiting");
    } else {
        setTimeout(function () {
            openModal("tracksetter");
            document.getElementById("percentcomplete").textContent = Math.round(100 - (100 * JSON.parse(localStorage.getItem("FailedDays")).contentvalue.length) / localStorage.getItem("GoalDays")) + "%";
        }, 1000);
    }
}
function cDate() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
}
function showItems() {
    for (let index = 0; index < localStorage.getItem("GoalDays"); index++) {
        var newdiv = document.createElement("div");
        newdiv.textContent = index+1;
        newdiv.classList.add("box");
        newdiv.onclick = function () {
            if (!event.target.classList.contains("complete") && !event.target.classList.contains("failed") && !event.target.classList.contains("later")) {
                openModal("goalquestioner");
            }
        }
        if (index < localStorage.getItem("DaysComplete")) {
            if (JSON.parse(localStorage.getItem("FailedDays")).contentvalue.includes((index+1).toString())) {
                newdiv.classList.add("failed");
            } else {
                newdiv.classList.add("complete");
            }
        } else if (index > localStorage.getItem("DaysComplete")) {
            newdiv.classList.add("later");
        }
        document.getElementById("boxes").appendChild(newdiv);
    }
    if (localStorage.getItem("DaysComplete") != localStorage.getItem("GoalDays")) {
        if (cDate().getTime() <= new Date(localStorage.getItem("LastCompletedDate")).getTime()) {
            document.getElementById("boxes").children[new Number(localStorage.getItem("DaysComplete"))].classList.add("later");
            document.getElementById("boxes").children[new Number(localStorage.getItem("DaysComplete"))].classList.add("waiting");
        }
    } else {
        openModal("tracksetter");
        document.getElementById("percentcomplete").textContent = Math.round(100 - (100 * JSON.parse(localStorage.getItem("FailedDays")).contentvalue.length) / localStorage.getItem("GoalDays")) + "%";
    }
    document.getElementById("intro").style.display = "none";
    document.getElementById("goalmenu").style.opacity = "0%";
    setTimeout(function () {document.getElementById("goalmenu").style.display = "none"}, 1000);
    document.getElementById("header").textContent = localStorage.getItem("GoalName");
    document.getElementById("content").style.display = "block";
}
if (localStorage.getItem("completedIntro") != "true") {
    IntroI = 1;
    document.getElementById("intro").style.display = "flex";
    document.getElementById("intro" + IntroI).style.display = "flex";
} else {
    document.getElementById("mainoption").textContent = localStorage.getItem("GoalName");
    document.getElementById("goalmenu").style.display = "flex";
}
function lastSibling(node) {
    var tempObj = node.parentNode.lastChild; 
        while (tempObj.nodeType!=1 && tempObj.previousSibling != null) {  
        tempObj = tempObj.previousSibling;   
    }  
    return (tempObj.nodeType==1)?tempObj:false; 
}
function openModal(modalid) {
    document.getElementById(modalid).style.animation = "modalin 0.75s";
    document.getElementById("modaloverlay").style.animation = "overlayin 2s";
    document.getElementById(modalid).style.display = "block";
    document.getElementById("modaloverlay").style.display = "flex";
}
function closeModal(yorn) {
    event.target.disabled = true;
    if (yorn) {
        event.target.nextSibling.disabled = true;
    } else if (!yorn) {
        lastSibling(event.target).disabled = true;
    } 
    event.target.parentElement.parentElement.style.animation = "modalout 0.75s";
    event.target.parentElement.parentElement.parentElement.style.animation = "overlayout 0.75s";
    TheEventTarget = event.target;
    setTimeout(() => {
        TheEventTarget.parentElement.parentElement.parentElement.style.display = "none";
        TheEventTarget.parentElement.parentElement.style.display = "none";
        TheEventTarget.disabled = false;
        if (yorn) {
            TheEventTarget.nextSibling.disabled = false;
        } else if (!yorn) {
            lastSibling(TheEventTarget).disabled = false;
        }
        delete TheEventTarget;
    }, 750);
}
function retryProject() {
    setTimeout(function () {
        localStorage.setItem("DaysComplete", 0);
        localStorage.setItem("FailedDays", JSON.stringify({ "contentvalue": [] }));
        localStorage.removeItem("LastCompletedDate");
        location.reload();
    }, 1000);
}
function resetAll() {
    setTimeout(function () {
        localStorage.clear();
        location.reload();
    }, 1000);
}