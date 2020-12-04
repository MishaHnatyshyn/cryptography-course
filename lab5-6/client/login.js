const loginForm = document.getElementById('login-form');
const API_URL = 'http://localhost:8080'

const handleLogin = async (e) => {
    e.preventDefault();

    const [usernameField, passwordField] = e.target;

    const username = usernameField.value;
    const password = passwordField.value;

    if (!username) {
        return alert('Username field is required!')
    }
    if (!password) {
        return alert('Password field is required!')
    }

    const body = JSON.stringify({
        username,
        password,
    })

    try {
        const response = await fetch(API_URL + '/login',{
            body,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            return alert('Wrong credentials!')
        }
        alert('Successful login!')
    } catch (e) {
        alert('Wrong credentials!')
    }
};

loginForm.addEventListener('submit', handleLogin)
