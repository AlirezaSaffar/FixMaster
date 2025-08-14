document.addEventListener('DOMContentLoaded', function () {

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const token = getCookie('token')
    if(token!= null)
        window.location.href='/'
    const form = document.getElementById('signup-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const roleSelect = document.getElementById('role');
    const errorMessages = [];

const cityGroup = document.getElementById('city-group');
const serviceGroup = document.getElementById('service-group');

roleSelect.addEventListener('change', () => {
    if (roleSelect.value === 'technician') {
        cityGroup.style.display = 'block';
        serviceGroup.style.display = 'block';
        document.getElementById('city').required = true;
        document.getElementById('service').required = true;
    } else {
        cityGroup.style.display = 'none';
        serviceGroup.style.display = 'none';
        document.getElementById('city').required = false;
        document.getElementById('service').required = false;
    }
});




    form.addEventListener('submit', function (event) {
        event.preventDefault(); 

        errorMessages.length = 0;

        if (nameInput.value.trim() === '') {
            errorMessages.push('Name is required');
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(emailInput.value)) {
            errorMessages.push('Please enter a valid email address');
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phoneInput.value)) {
            errorMessages.push('Please enter a valid phone number');
        }

        if (passwordInput.value.length < 6) {
            errorMessages.push('Password must be at least 6 characters');
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            errorMessages.push('Passwords do not match');
        }

        if (roleSelect.value === '') {
            errorMessages.push('Please select a role (Customer or Technician)');
        }
        const cityInput = document.getElementById('city');
const serviceSelect = document.getElementById('service');

if (roleSelect.value === 'technician') {
    if (cityInput.value === '') {
        errorMessages.push('City is required for technicians');
    }
    if (serviceSelect.value === '') {
        errorMessages.push('Please select a service type');
    }
}


        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'));
            return;
        }
        var serv= serviceSelect.value
        if(roleSelect.value === 'customer'){
serv = 'none'
        }
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            password: passwordInput.value,
            role: roleSelect.value,
            city: cityInput.value,
            service: serv

        };
    

        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Signup successful! Redirecting...');
                window.location.href = '/login';
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while signing up. Please try again.');
        });
    });
});
