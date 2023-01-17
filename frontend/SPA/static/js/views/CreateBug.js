import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Bug creation");
        document.projectId = params.projectId;
        document.projectName = params.projectName;
        document.sendBugToBe = this.sendBugToBe;
    }

    async getHtml() {
        return `
        <div class="auth-container">
            <h1>File a bug for ${this.projectName}!</h1>
            <form method="post" onsubmit="event.preventDefault()">
                <input type="text" placeholder="Bug name..." required="required" id="bug-name" />
                <textarea type="text" placeholder="Bug's description..." required="required" id="bug-description"></textarea>
                <input type="text" placeholder="Causing commit link..." required="required" id="bug-causing-commit"/>
                <div class="justify-space-between">
                    <select name="severity" class="select-input" id="bug-severity">
                        <option value="wrong-value">Severity level</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <select name="priority" class="select-input" required="required" id="bug-priority">
                        <option value="wrong-value">Priority level</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <button class="btn btn-primary btn-block btn-large" onclick="sendBugToBe('${this.projectName}')">File bug!</button>
            </form>
        </div>
        `;
    }

    async sendBugToBe(projectName) {
        const bugName = document.querySelector('#bug-name').value;
        const bugDescription = document.querySelector('#bug-description').value;
        const projIdBug = this.projectId;
        const causingCommit = document.querySelector('#bug-causing-commit').value;
        const bugSeverity = document.querySelector('#bug-severity').value;
        const bugPriority = parseInt(document.querySelector('#bug-priority').value);

        let data = {
            name: bugName,
            description: bugDescription,
            severity: bugSeverity,
            priority: bugPriority,
            caussingCommit: causingCommit,
            resolvingCommit: '',
        };
        fetch('http://localhost:8080/projects/' + projIdBug + '/bugs', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Authorization': "Bearer " + sessionStorage.getItem('token'), 'Content-type': 'application/json' }
        })
            .then((response) => {
                if(response.status === 403){
                    alert("You are not a tester for this project, so you can't file a bug!");
                }
                return response.json()})
            .then((data) => {
                console.log(data);
                if(data.name != null){
                    alert("The bug: " + bugName + " has been created for the project: " + this.projectName);
                    history.pushState(null, null, "/projects");
                    location.reload();
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}