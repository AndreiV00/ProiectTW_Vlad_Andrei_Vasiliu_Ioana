import AbstractView from "./AbstractView.js";

const BUGS = [
    {
        id: "1",
        userId: "12",
        name: "Bug1",
        desciption: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        severity: 5,
        priority: 1,
        causingCommit: "https://stackoverflow.com/questions/265478/preventdefault-on-an-a-tag",
        resolvingCommit: "https://stackoverflow.com/questions/265478/preventdefault-on-an-a-tag"
    },
    {
        id: "2",
        userId: "12",
        name: "Bug2",
        desciption: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        severity: 1,
        priority: 5,
        causingCommit: "https://stackoverflow.com/questions/265478/preventdefault-on-an-a-tag",
        resolvingCommit: "https://stackoverflow.com/questions/265478/preventdefault-on-an-a-tag"
    }
];

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.projectId = params.projectId;
        this.setTitle("Project bugs");
    }

    async getHtml() {
        return `
            <h1>Post</h1>
            <p>You are viewing project #${this.projectId}.</p>
        `;
    }

    async getHtml() {
        const bugs = await this.getFromBe();
        if(bugs.length <= 0){
            return `
            <h1 class="page-title bugs">These are the bugs you filed!</h1>
            <div class="page-container bugs">
                <h1>No bugs for this project YET!</h1>
            </div>
            `;
        }
        return `
            <h1 class="page-title bugs">These are the bugs you filed!</h1>
            <div class="page-container bugs">
                ${bugs?.map((bug) => {
            return `
                    <div class="card-container-list bugs">
                        <div class="card-details-container bugs">
                            <div>
                                <h2>${bug.name}</h2>
                                <p>${bug.description}</p>
                            </div>
                            <div>
                                <h3>Severity: ${bug.severity}</h3>
                                <h3>Priority: ${bug.priority}</h3>
                            </div>
                        </div>
                        <div class="buttons-container">
                            <a class="btn btn-primary btn-block btn-large" href="${bug.causingCommit}">Go to causing commit!</a>
                            <a class="btn btn-primary btn-block btn-large" href="${bug.resolvingCommit}">Go to resolving commit!</a>
                        </div>
                    </div>
            `}
        ).join('')}
            </div>
            <a class="btn btn-primary btn-block btn-large" id="file-a-bug-button" onclick="goToFileABugPage()">File a new bug!</a>
        `;
    }

    async getFromBe() {
        return await fetch('http://localhost:8080/projects/' + this.projectId + '/bugs', {
            method: 'GET',
            headers: { 'Authorization': "Bearer " + sessionStorage.getItem('token'), 'Content-type': 'application/json' }
        }).then(response => response.json());
    }
}


