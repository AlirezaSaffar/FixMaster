document.addEventListener('DOMContentLoaded', () => {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const token = getCookie('token');
    const role = getCookie('role');

    if(role==='customer'){
       document.getElementById('getstarted').href= '/new-request'
        document.getElementById('cta-btn').href= '/new-request'

    }
    if(role==='technician'){
document.getElementById('getstarted').href= '/available-jobs'
document.getElementById('cta-btn').href= '/available-jobs'
    }
    
    const navbar = document.getElementById('navbar');
    const featureCards = document.querySelector('.feature-cards');

    if (token) {
        if (role === 'technician') {
            navbar.innerHTML = `
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/appointments">My Appointments</a></li>
                <li><a href="/login" id="logout-button">Logout</a></li>
            `;
        } else if (role === 'customer') {
            navbar.innerHTML = `
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/appointments">My Appointments</a></li>
                <li><a href="/requests">My Requests</a></li>
                <li><a href="/technicians">Find Technicians</a></li>
                <li><a href="/login" id="logout-button">Logout</a></li>
            `;
        }
    } else {
        navbar.innerHTML = `
            <li><a href="/technicians">Find Technicians</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Signup</a></li>
            

        `;
    }

    // Features logic
    if (role === 'technician') {
        featureCards.innerHTML = `
            <div class="card"><span>📋</span><h3>Manage Requests</h3><p>View and update all service requests you receive.</p></div>
            <div class="card"><span>🗓</span><h3>Schedule Jobs</h3><p>Organize your daily and weekly work schedule easily.</p></div>
            <div class="card"><span>💰</span><h3>Set Your Prices</h3><p>Define and adjust your service rates anytime.</p></div>
            <div class="card"><span>⭐</span><h3>Customer Ratings</h3><p>Get feedback and improve your profile ranking.</p></div>
        `;
    } else {
        featureCards.innerHTML = `
            <div class="card"><span>🔍</span><h3>Find Technicians</h3><p>Search skilled technicians near your location.</p></div>
            <div class="card"><span>📅</span><h3>Book Appointments</h3><p>Choose the best time that works for you.</p></div>
            <div class="card"><span>💳</span><h3>Online Payment</h3><p>Secure and fast payments through our platform.</p></div>
            <div class="card"><span>⭐</span><h3>Customer Reviews</h3><p>See feedback from previous customers.</p></div>
        `;
    }

    // Logout handler
    document.getElementById('logout-button')?.addEventListener('click', () => {
        document.cookie = 'token=; Max-Age=0; path=/'; 
        document.cookie = 'role=; Max-Age=0; path=/'; 
        window.location.href = '/login';
    });
    // CTA dynamic content
const ctaTitle = document.getElementById('cta-title');
const ctaBtn = document.getElementById('cta-btn');

if (role === 'technician') {
    ctaTitle.textContent = "Ready to Offer Your Services?";
    ctaBtn.textContent = "View Customer Requests";
    ctaBtn.href = "/available-jobs";
} else {
    ctaTitle.textContent = "Need a Service Now?";
    ctaBtn.textContent = "Request Service";
    
    ctaBtn.href = "/signup";
    if(role==='customer'){
        ctaBtn.href = "/new-request";
    }
}

});


