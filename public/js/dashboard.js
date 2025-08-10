document.addEventListener('DOMContentLoaded', () => {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    // function getcookie(name) {
    //     var nmae = +"=";
    //     var decodecookie = decodeURIComponent(document.cookie);
    //     var x = decodecookie.split(";");
    //     var i;
    //     var xx;
    //     for (i = 0; i < x.length; i++) {
    //       xx = x[i];
    //       while (xx.charAt(0) == " ") {
    //         xx = xx.substring(1);
    //       }
    //       if (xx.indexOf(name) == 0) {
    //         return xx.substring(name.length + 1);
    //       }
    //     }
    //     return " ";
    //   }
      

    const token = getCookie('token');
    
    if (!token) {
         window.location.href = '/login'; 
    }

    fetch('/api/user/dashbord', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const user = data.response;
            document.getElementById('user-name').innerText = user.name;
            document.getElementById('user-email').innerText = user.email;
            document.getElementById('user-phone').innerText = user.phone;
            document.getElementById('user-role').innerText = user.role === 'technician' ? 'Technician' : 'Customer';
        } else {
            alert('Error loading user data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch user data');
    });
    
    document.getElementById('logout-button').addEventListener('click', () => {
        document.cookie = 'token=; Max-Age=0; path=/'; 
        window.location.href = '/login.html'; 
    });
});
