console.log("------Build menu-------");

var menu = [ { "title": "Accueil", "link":"home.php" },
    { "title": "Blog",
        "submenu": [ {"title":"News","link":"news.php"},
                    {"title":"Archives","link":"archives.php"}
                    ]},
    { "title": "FAQ", "link":"faq.php" }];

function build_menu(menu) {
    var ul = document.createElement('ul');

    for (var i = 0; i < menu.length; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');

        if (menu[i].hasOwnProperty('link'))
            a.setAttribute('href', menu[i].link);
        else
            a.setAttribute('href', '#');

        a.innerHTML = menu[i].title;
        li.appendChild(a);

        if (menu[i].hasOwnProperty('submenu'))
            li.appendChild(build_menu(menu[i].submenu));

        ul.appendChild(li);

    }

    return ul;
}

document.body.appendChild(build_menu(menu));

console.log("------Request Ajax-------");

var oXHR = new XMLHttpRequest();
oXHR.open("GET", 'http://owapi.net/api/v3/u/Applelo-2285/blob', true);

oXHR.onreadystatechange = function (oEvent) {
    if (oXHR.readyState === 4) {
        if (oXHR.status === 200) {
            console.log("Résultat", JSON.parse(oXHR.response));
        } else {
            console.log("Erreur : ", oXHR.statusText);
        }
    }
};

oXHR.send(null);
