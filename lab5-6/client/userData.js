const userDataForm = document.getElementById('user-data');
const getDataButton = document.getElementById('getDataButton');
const API_URL = 'http://localhost:8080';

const handleDataUpdate = async (e) => {
    e.preventDefault();

    const [usernameField, passwordField, phoneField, emailField, addressField] = e.target;

    const username = usernameField.value;
    const password = passwordField.value;
    const phone = phoneField.value;
    const email = emailField.value;
    const address = addressField.value;

    if (!username) {
        return alert('Username field is required!')
    }
    if (!password) {
        return alert('Password field is required!')
    }

    const body = JSON.stringify({
        username,
        password,
        data: {
            phone,
            email,
            address
        }
    })

    try {
        const response = await fetch(API_URL + '/user',{
            body,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 401) {
            alert('Wrong credentials!')
        }
        alert('Successfully updated!');
    } catch (e) {
        alert('Something went wrong!');
    }
};

const handleGettingData = async (e) => {
    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;

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
        const response = await fetch(API_URL + '/user',{
            body,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 401) {
            return alert('Wrong credentials!')
        }
        const {data} = await response.json();
        alert(`
        phone: ${data?.phone}
        email: ${data?.email} 
        address: ${data?.address}
        `);
    } catch (e) {
        alert('Something went wrong!');
    }
}

userDataForm.addEventListener('submit', handleDataUpdate)
getDataButton.addEventListener('click', handleGettingData)
