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
        return alert('Password field is required!')
    }
    if (password !== passwordRepeat) {
        return alert('Password should equals Repeated Password')
    }
    if (password.length < 8) {
        return alert('Min password length is 8!')
    }
    if (!/[A-Z]/.test(password)) {
        return alert('At least one capital letter is required')
    }
    if (!/[a-z]/.test(password)) {
        return alert('At least one small letter is required')
    }
    if (!/[0-9]/.test(password)) {
        return alert('At least one number is required')
    }
    if (!/[\!\@\#\$\%\^\&\*\(\)\_\+\{\}\[\]\:\;]/.test(password)) {
        return alert('At least one special character is required')
    }

    const body = JSON.stringify({
        username,
        password,
    })

    try {
        await fetch(API_URL + '/register', {
            body,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        alert('Successful register!')
    } catch (e) {
        alert('Something went wrong!')
    }
};

registrationForm.addEventListener('submit', handleRegister)



