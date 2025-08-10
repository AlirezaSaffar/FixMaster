

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessages = [];

    form.addEventListener('submit', function (event) {
        event.preventDefault(); 

        errorMessages.length = 0;

        if (emailInput.value.trim() === '') {
            errorMessages.push('Email is required');
        }

        if (passwordInput.value.trim() === '') {
            errorMessages.push('Password is required');
        }

        if (errorMessages.length > 0) {
            alert(errorMessages.join('\n'));
            return;
        }

        const formData = {
            email: emailInput.value,
            password: passwordInput.value,
        };

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login successful! Redirecting...');
                window.location.href = '/dashboard'; 
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again.');
        });
    });
});
