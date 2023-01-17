import Dashboard from "./views/Dashboard.js";
import Bugs from "./views/Bugs.js";
import PostView from "./views/BugView.js";
import Projects from "./views/Projects.js";
import Login from "./views/Login.js";
import Register from "./views/Register.js";
import CreateBug from "./views/CreateBug.js";
import ProjectBugs from "./views/ProjectBugs.js";

//Rutare url
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

//Acceseaza path-uri
const router = async () => {

    let routes= [];

    const isTokenAvailable = sessionStorage.getItem('token');
    //daca nu sunt logat
    if (!isTokenAvailable){
        document.querySelector("#navbar").style.visibility="hidden";
        routes = [
            { path: "/", view: Login },
            { path: "/login", view: Login },
            { path: "/register", view: Register }
        ];
    }
    //daca sunt logat
    else{
        document.querySelector("#navbar").style.visibility="visible";
        document.querySelector("#login-button").style.visibility="hidden";
        routes = [
            { path: "/", view: Dashboard },
            { path: "/login", view: Dashboard },
            { path: "/register", view: Dashboard },
            { path: "/bugs/creation", view: CreateBug },
            { path: "/bugs", view: Bugs },
            { path: "/bugs/:id", view: PostView },
            { path: "/projects/:projectId/bugs", view: ProjectBugs },
            { path: "/projects", view: Projects },
        ];
    }  

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(getParams(match));

        //aici se randeaza in index.html (div)
    document.querySelector("#app").innerHTML = await view.getHtml();

};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});