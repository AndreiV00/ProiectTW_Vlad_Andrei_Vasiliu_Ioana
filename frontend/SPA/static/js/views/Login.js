import AbstractView from './AbstractView.js';
import Register from './Register.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Login');
    document.navigateToRegisterPage = this.navigateToRegisterPage;
    document.sendLoginToBe = this.sendLoginToBe;
  }

  async getHtml() {
    return `
        <div class="auth-container">
            <h1>Login</h1>
            <form method="post" onsubmit="event.preventDefault()">
                <input type="text" placeholder="Email" required="required" id="email"/>
                <input type="password" name="p" placeholder="Password" required="required" id="password"/>
                <button type="submit" class="btn btn-primary btn-block btn-large" onClick="sendLoginToBe()">Let me in.</button>
                <a onclick="navigateToRegisterPage()">No account? Click here.</a>
            </form>
        </div>
        `;
  }

  async navigateToRegisterPage() {
    history.pushState(null, null, 'register');
    var register = new Register();
    document.querySelector('#app').innerHTML = await register.getHtml();
  }

  async sendLoginToBe() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/login');
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

    const password = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;

    const request = {
      email: email,
      password: password
    };

    xhr.send(JSON.stringify(request));

    xhr.onload = async function (e) {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const { token, user_details } = JSON.parse(xhr.responseText);
        if (token) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userName', user_details.userName);
          sessionStorage.setItem('userRole', user_details.userRole);
          sessionStorage.setItem('userId', user_details.userId);
          history.pushState(null, null, 'dashboard');
          location.reload();
          alert("Logged in successfully!");
        }
      }
    }
  }
}
