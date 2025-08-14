document.addEventListener("DOMContentLoaded", () => {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const token = getCookie("token");
    const role = getCookie("role");

   
    const cityFilter = document.getElementById("city-filter");
    const serviceFilter = document.getElementById("service-filter");
    const applyBtn = document.getElementById("apply-filters");
    const techniciansList = document.getElementById("technicians-list");

    const navbar = document.getElementById('navbar');
    if(role){
    navbar.innerHTML = `
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/login" id="logout-button">Logout</a></li>
`;
    }else{
        navbar.innerHTML = `
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Signup</a></li>
        

    `;
    }
    


    function fetchTechnicians() {
        const city = cityFilter.value.trim();
        const service = serviceFilter.value;

        let query = [];
        if (city) query.push(`city=${encodeURIComponent(city)}`);
        if (service) query.push(`service=${encodeURIComponent(service)}`);
        const queryString = query.length ? `?${query.join("&")}` : "";
        fetch(`/api/auth/technicians${queryString}`)
            .then(res => res.json())
            .then(data => {
                techniciansList.innerHTML = "";
                if (data.success && data.technicians.length > 0) {
                    data.technicians.forEach(tech => {
                        const card = document.createElement("div");
                        card.classList.add("technician-card");
                        card.innerHTML = `
                            <h3>${tech.name}</h3>
                            <p><strong>City:</strong> ${tech.city}</p>
                            <p><strong>Service:</strong> ${tech.service}</p>
                        `;
                        card.addEventListener("click", () => {
                            window.location.href = `/technician-profile?id=${tech._id}`;
                        });
                        techniciansList.appendChild(card);
                    });
                } else {
                    techniciansList.innerHTML = "<p>No technicians found.</p>";
                }
            })
            .catch(err => {
                console.error(err);
                techniciansList.innerHTML = "<p>Error loading technicians.</p>";
            });
    }

    // Initial fetch
    fetchTechnicians();

    // On filter click
    applyBtn.addEventListener("click", fetchTechnicians);
});
