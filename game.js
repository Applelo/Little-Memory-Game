/*
Dans le dossier, il faut exécuter la commande "npm i" puis "npm start" pour lancer le serveur.
Celui ci fait tourner l'API impactant le fichier scores.json contenant les données des scores.
*/

console.log("+++++GAME++++++");
//Paramètres
var color = ['red', 'blue', 'orange', 'green'];
var nbrCase = 3;
var nbrColor = 4;
var start = false;
var baseTableData;
var nbrClick = 0;
var score = 0;

function build_table(nbrCase, nbrColor) {

    var table = document.createElement('table');
    table.setAttribute("id", "table");

    for (var i = 0; i < nbrCase; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < nbrCase; j++) {
            var td = document.createElement('td');
            td.setAttribute("data-y", i);
            td.setAttribute("data-x", j);
            var randomizer = Math.floor(Math.random() * nbrColor);
            td.setAttribute("data-color", randomizer);
            td.style.border = "solid 1px black";
            td.style.width = '100px';
            td.style.height = '100px';
            td.style.backgroundColor = color[randomizer];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}

function build_controls(nbrCase, nbrColor) {
    var div = document.createElement("div");
    div.setAttribute("id", "controls");
    var br = document.createElement("br");


    var selectNbrCase = document.createElement("select");
    selectNbrCase.setAttribute("id", "selectNbrCase");

    var selectNbrColor = document.createElement("select");
    selectNbrColor.setAttribute("id", "selectNbrColor");

    var pNbrCase = document.createElement("p");
    pNbrCase.innerHTML = "Nombre de case : ";

    var pNbrColor = document.createElement("p");
    pNbrColor.innerHTML = "Nombre de couleur : ";


    var startButton = document.createElement("button");
    startButton.setAttribute("id", "start");
    startButton.innerHTML = "Commencer";


    var option;
    for (i = 2; i <= 6; i++) {
        option = document.createElement("option");
        option.innerHTML = i;
        option.value = i;
        if (nbrCase == i)
            option.setAttribute("selected", "selected");
        selectNbrCase.appendChild(option)
    }

    for (i = 2; i <= 4; i++) {
        option = document.createElement("option");
        option.innerHTML = i;
        option.value = i;
        if (nbrColor == i)
            option.setAttribute("selected", "selected");
        selectNbrColor.appendChild(option)
    }

    pNbrCase.appendChild(selectNbrCase);
    pNbrColor.appendChild(selectNbrColor);

    pNbrCase.appendChild(br);
    pNbrColor.appendChild(br);

    div.appendChild(pNbrCase);
    div.appendChild(pNbrColor);
    div.appendChild(startButton);

    return div;

}

function build_scoreboard(score) {
    var div = document.createElement("div");
    div.setAttribute("id", "scoreboard");
    var h2 = document.createElement("h2");
    h2.innerHTML = "Tableau des scores";
    var table = document.createElement("table");
    console.log(score);
    var header = ["Score", "Nombre de clique", "Nombre de case", "Nombre de couleur"];

    for (i = score.length; i >= 0; i--) {
        var tr = document.createElement("tr");
        if (i == score.length) { //Scoreboard Header
            for (j = 0; j < header.length; j++) {
                var th = document.createElement("th");
                th.innerHTML = header[j];
                th.style.border = "solid 1px black";
                tr.appendChild(th);
            }
        }
        else {//data

            var tdScore = document.createElement("td");
            tdScore.innerHTML = score[i].score;
            tdScore.style.border = "solid 1px black";
            tr.appendChild(tdScore);

            var tdClick = document.createElement("td");
            tdClick.innerHTML = score[i].nbrClick;
            tdClick.style.border = "solid 1px black";
            tr.appendChild(tdClick);

            var tdCase = document.createElement("td");
            tdCase.innerHTML = score[i].nbrCase;
            tdCase.style.border = "solid 1px black";
            tr.appendChild(tdCase);

            var tdColor = document.createElement("td");
            tdColor.innerHTML = score[i].nbrColor;
            tdColor.style.border = "solid 1px black";
            tr.appendChild(tdColor);


        }

        table.appendChild(tr);

    }

    div.appendChild(h2);
    div.appendChild(table);

    return div;
}

Element.prototype.getTableData = function() {
    var arr = [];

    var trElements = this.children;
    for (i = 0; i < trElements.length; i++) {
        arr[i] = [];
        var tdElements = trElements[i].children;
        for (j = 0; j < tdElements.length; j++) {
            arr[i][j] = tdElements[j].getAttribute("data-color");
        }
    }

    return arr;
};

function getLimitColor(color) {
    color++;

    if (color > (nbrColor - 1))
        color = 0;

    return color;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length != arr2.length)
        return false;

    for (i=0; i< arr1.length; i++) {
        for (j=0; j < arr1[i].length; j++) {
            if (arr1[i][j] != arr2[i][j])
                return false;
        }
    }

    return true;
}

function calcScore(nbrClick, nbrColor, nbrCase) {
    return Math.floor(((nbrColor*nbrColor) * (nbrCase*nbrColor)) / nbrClick);
}

function events() {
    if (start) {
        var intervalAnimation = setInterval(function(){
            var result = build_table(nbrCase, nbrColor);
            var the_table = document.getElementById("table");
            the_table.replaceWith(result);
        }, 200);

        setTimeout(function(){
            clearInterval(intervalAnimation);
            var tableData = document.getElementById("table").getTableData();
            //prevent win without click
            while (arraysEqual(baseTableData, tableData)) {
                var result = build_table(nbrCase, nbrColor);
                var the_table = document.getElementById("table");
                the_table.replaceWith(result);
                tableData = document.getElementById("table").getTableData();
            }


            document.getElementById("table").onclick = function(e) {
                if (e.target.getAttribute("data-x") && e.target.getAttribute("data-y")) {
                    dataColor = e.target.getAttribute("data-color");
                    var limitColor = getLimitColor(dataColor);
                    e.target.style.backgroundColor = color[limitColor];
                    e.target.setAttribute("data-color", limitColor);
                    nbrClick++;

                    tableData = document.getElementById("table").getTableData();
                    if (arraysEqual(baseTableData, tableData)) {
                        score = calcScore(nbrClick, nbrColor, nbrCase);
                        addScore(score, nbrClick, nbrColor, nbrCase);
                        updateScoreboard();
                        var the_div = document.getElementById("controls");
                        the_div.replaceWith(build_controls(nbrCase, nbrColor));
                        var the_table = document.getElementById("table");
                        the_table.replaceWith(build_table(nbrCase, nbrColor));
                        start = false;
                        events();
                    }


                }
            }
        }, 1000);

        document.getElementById("stop").onclick = function() {
            var the_div = document.getElementById("controls");
            the_div.replaceWith(build_controls(nbrCase, nbrColor));
            var the_table = document.getElementById("table");
            the_table.replaceWith(build_table(nbrCase, nbrColor));
            start = false;
            events();
        }


    }
    else {

        document.getElementById("selectNbrCase").onchange = function() {
            nbrCase = document.getElementById("selectNbrCase").value;
            var result = build_table(nbrCase, nbrColor);
            var the_table = document.getElementById("table");
            the_table.replaceWith(result);
        };

        document.getElementById("selectNbrColor").onchange = function() {
            nbrColor = document.getElementById("selectNbrColor").value;
            var result = build_table(nbrCase, nbrColor);
            var the_table = document.getElementById("table");
            the_table.replaceWith(result);
        };

        document.getElementById("start").onclick = function() {
            baseTableData = document.getElementById("table").getTableData();
            var the_div = document.getElementById("controls");
            var div = document.createElement("div");
            div.setAttribute("id", "controls");
            var stopButton = document.createElement("button");
            stopButton.innerHTML = "Quitter"
            stopButton.setAttribute("id","stop");
            div.appendChild(stopButton);
            the_div.replaceWith(div);
            start = true;
            events();
        }

    }
}

//Méthodes ajax
function addScore(score, nbrClick, nbrColor, nbrCase) {
    var oXHR = new XMLHttpRequest();
    oXHR.open("POST", 'http://localhost:8081/score', true);
    oXHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    oXHR.send("score=" + score + "&nbrClick=" + nbrClick + "&nbrColor=" + nbrColor + "&nbrCase=" + nbrCase);

    oXHR.onreadystatechange = function (oEvent) {
        if (oXHR.readyState === 4) {
            if (oXHR.status === 200) {
                console.log("Résultat", "Success");
            } else {
                console.log("Erreur : ", oXHR.statusText);
            }
        }
    };
}

function updateScoreboard() {
    var oXHR = new XMLHttpRequest();
    oXHR.open("GET", 'http://localhost:8081/score', true);
    oXHR.send(null);
    oXHR.onreadystatechange = function (oEvent) {
        if (oXHR.readyState === 4) {
            if (oXHR.status === 200) {
                var newScoreboard = build_scoreboard(JSON.parse(oXHR.response));
                var oldScoreboard = document.getElementById("scoreboard");
                if (oldScoreboard)
                    oldScoreboard.replaceWith(newScoreboard);
                else
                    the_body.appendChild(newScoreboard);
            } else {
                console.log("Erreur : ", oXHR.statusText);
            }
        }
    };
}


//Construct the page
var the_body = document.body;
the_body.appendChild(build_table(nbrCase, nbrCase));
the_body.appendChild(build_controls(nbrCase, nbrColor));
updateScoreboard();
events();