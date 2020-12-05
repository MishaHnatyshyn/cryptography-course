const registrationForm = document.getElementById('registration-form');
const API_URL = 'http://localhost:8080'

const handleRegister = async (e) => {
    e.preventDefault();

    const [usernameField, passwordField, passwordRepeatField] = e.target;
    const username = usernameField.value;
    const password = passwordField.value;
    const passwordRepeat = passwordRepeatField.value;

    if (!username) {
        return alert('Username field is required!')
    }
    if (!password) {
        return alert('Password field is required!')
    }
    if (!passwordRepeat) {
        return alert('Repeat password field is required!')
    }
    if (password !== passwordRepeat) {
        return alert('Password should equals Repeated Password')
    }
    if (password.length < 8) {
        return alert('Min password length is 8!')
    }

    const body = JSON.stringify({
        username,
        password,
    })

    try {
        const response = await fetch(API_URL + '/register', {
            body,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            const message = await response.text();
            return alert(message);
        }
        alert('Successful register!')
    } catch (e) {
        alert('Something went wrong!')
    }
};

registrationForm.addEventListener('submit', handleRegister)



