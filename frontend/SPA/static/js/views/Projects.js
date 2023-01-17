import AbstractView from "./AbstractView.js";
import ProjectBugs from "./ProjectBugs.js";
import CreateBug from "./CreateBug.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Projects");
        document.toogleAddProjectModal = this.toogleAddProjectModal;
        document.sendProjectToBe = this.sendProjectToBe;
        document.getAllProjectsFromBe = this.getAllProjectsFromBe;
        document.navigateToProjectBugsPage = this.navigateToProjectBugsPage;
        document.goToFileABugPage = this.goToFileABugPage;
        document.joinAsTester = this.joinAsTester;
    }


    async getHtml() {
        const projects = await this.getAllProjectsFromBe();
        if (projects.length <= 0) {
            return `<h1> There are no projects to display!
            <div class="page-container projects">
            <div class="modal-background" id="add-new-project-modal">
                    <div class="modal-container">
                        <h1>Create a new project!</h1>
                        <button id="close-modal-button" onclick="toogleAddProjectModal()">X</button>
                        <form method="post" onsubmit="event.preventDefault()">
                            <input type="text" placeholder="Project name" required="required" id="project-name"/>
                            <textarea type="text" placeholder="Project description..." required="required" id="project-description" class="textarea-add-project"></textarea>
                            <input type="text" placeholder="Project repository" required="required" id="project-repo"/>
                        </form>
                        <a class="btn btn-primary btn-block btn-large" onclick="sendProjectToBe()">Create project!</a>
                    </div>
                </div>
                <button id="add-new-project-button" onclick="toogleAddProjectModal()">+</button>
            </div>`;
        }
         else {
            return `

            <h1 class="page-title projects">Projects page!</h1>
            <div class="page-container projects">
        ${projects.map((project) => {
                return `
                <div class="card-container-list projects">
                    <div class="card-details-container projects" onclick="navigateToProjectBugsPage('${project._id}')">
                        <div>
                            <h2>${project.name}</h2>
                            <p>${project.description}</p>
                        </div>
                    </div>
                    <div class="buttons-container">
                        <a class="btn btn-primary btn-block btn-large" onclick="goToFileABugPage('${project._id}', '${project.name}')">Add a bug!</a>
                        <a class="btn btn-primary btn-block btn-large" onclick="joinAsTester('${project._id}')">Join as tester!</a>
                    </div>
                </div>
            `
            }).join('')}
                
                


                <div class="modal-background" id="add-new-project-modal">
                    <div class="modal-container">
                        <h1>Create a new project!</h1>
                        <button id="close-modal-button" onclick="toogleAddProjectModal()">X</button>
                        <form method="post" onsubmit="event.preventDefault()">
                            <input type="text" placeholder="Project name" required="required" id="project-name"/>
                            <textarea type="text" placeholder="Project description..." required="required" id="project-description" class="textarea-add-project"></textarea>
                            <input type="text" placeholder="Project repository" required="required" id="project-repo"/>
                        </form>
                        <a class="btn btn-primary btn-block btn-large" onclick="sendProjectToBe()">Create project!</a>
                    </div>
                </div>
                <button id="add-new-project-button" onclick="toogleAddProjectModal()">+</button>
            </div>
            <div class="toast-placeholder"></div>
        `};
    }
    //Fereastra pop-up, este mereu deschisa dar noi o facem ori vizibila ori invizibila
    async toogleAddProjectModal() {
        const visibility = document.querySelector("#add-new-project-modal").style.visibility;
        if (visibility === "" || visibility === "hidden") {
            document.querySelector("#add-new-project-modal").style.visibility = "visible";
        } else {
            document.querySelector("#add-new-project-modal").style.visibility = "hidden";
        }
    }

    async navigateToProjectBugsPage(projectId) {
        history.pushState(null, null, '/projects/' + projectId + "/bugs");
        var projectBugs = new ProjectBugs({ projectId: projectId });
        document.querySelector('#app').innerHTML = await projectBugs.getHtml();
    }

    async goToFileABugPage(projectId, projectName) {
        history.pushState(null, null, "bugs/creation");
        console.log(projectId + " " + projectName);
        var createBug = new CreateBug({ projectId: projectId, projectName: projectName });
        document.querySelector("#app").innerHTML = await createBug.getHtml();
    }

    async sendProjectToBe() {
        const projectName = document.querySelector("#project-name").value;
        const projectRepo = document.querySelector("#project-repo").value;
        const projectDescription = document.querySelector("#project-description").value;
        const data = {
            name: projectName,
            repositoryUrl: projectRepo,
            description: projectDescription
        }
        fetch('http://localhost:8080/projects', {
            method: 'POST',
            body: JSON.stringify(data),
            //Pt autentificare
            headers: { 'Authorization': "Bearer " + sessionStorage.getItem('token'), 'Content-type': 'application/json' }
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Project has been added successfully to the database!");
                location.reload();
            })
            .catch((error) => {
                alert("Received the following error from the server:" + error);
            });
    }

    async getAllProjectsFromBe() {
        let projects = await fetch('http://localhost:8080/projects', {
            method: 'GET',
            headers: { 'Authorization': "Bearer " + sessionStorage.getItem('token'), 'Content-type': 'application/json' }
        })
            .then((response) => response.json())

        return projects;
    }

    async joinAsTester(projectId) {

        fetch('http://localhost:8080/projects/' + projectId, {
            method: 'PUT',
            headers: { 'Authorization': "Bearer " + sessionStorage.getItem('token'), 'Content-type': 'application/json' }
        })
            .then((response) => {
                if (response.status === 403) {
                    if (alert("You already have assigned a role!")) {
                        console.log("ok");
                    }
                }
                return response.json()
            })
            .then((data) => {
                if (data.token != undefined) {
                    sessionStorage.clear();
                    sessionStorage.setItem('token', data.token);
                    if (alert("You were made a tester")) {
                        console.log("ok");
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}