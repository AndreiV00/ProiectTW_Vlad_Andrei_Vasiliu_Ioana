import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    document.PostRequest = this.PostRequest;
    this.setTitle('Rgister');
  }

  async getHtml() {
    return `
        <div class="auth-container">
            <h1>Register</h1>
            <form id="form1" onsubmit="event.preventDefault()">
                <input type="text" placeholder="Email" required="required" id="email"/>
                <input type="text" placeholder="Username" required="required" id="username"/>
                <input type="password" placeholder="Password" required="required" id="password"/>
                <button class="btn btn-primary btn-block btn-large" onClick="PostRequest()">Create account.</button>
            </form>
        </div>
        `;
  }

  async PostRequest() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;

    let data = {
      name: username,
      email: email,
      password: password
    };

    fetch('http://localhost:8080/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json' }
    })
      .then((response) => {
        if (response.status === 409) {
          alert("Email or password already used!");
        }
        return response.json()
      })
      .then((data) => {
        if (data.token != undefined) {
          sessionStorage.clear()
          history.pushState(null, null, "/login");
          location.reload();
        }
      })
      .catch((error) => {
        alert("Received the following error from the server:" + error);
      });
  }
}
