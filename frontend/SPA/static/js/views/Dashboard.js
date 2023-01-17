import AbstractView from "./AbstractView.js";
import Bugs from "./Bugs.js";
import Projects from "./Projects.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
        document.navigateToMyBugsPage = this.navigateToMyBugsPage;
        document.navigateToProjectsPage = this.navigateToProjectsPage;
    }

    async getHtml() {
        return `
        <div class="dashboard-container">
            <div>
                <div>
                    <h3>My projects</h3>
                    <i class="fa-regular fa-folder-open dashboard-icons" onclick="navigateToProjectsPage()"></i>
                </div>
            </div>
            <div>
                <div>
                    <h3>My bugs</h3>
                    <i class="fa-solid fa-bug dashboard-icons" onclick="navigateToMyBugsPage()"></i>
                </div>
            </div>
        </div>
        `;
    }

    async navigateToProjectsPage() {
        history.pushState(null, null, "projects");
        var projects = new Projects;
        document.querySelector("#app").innerHTML = await projects.getHtml();
    }

    async navigateToMyBugsPage(){
        history.pushState(null, null, "bugs");
        var createBug = new Bugs;
        document.querySelector("#app").innerHTML = await createBug.getHtml();
    }
}