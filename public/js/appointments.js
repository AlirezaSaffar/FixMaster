function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const check = getCookie('token');
if (!check) {
    window.location.href = "/login";
}

const role = getCookie('role'); 
let selectedAppointmentId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const role = getCookie('role');
    if(role==="customer"){
        document.getElementById("req").style.display="block"
        document.getElementById("calendar").style.display="none"
    }else{
        document.getElementById("findtech").style.display="none"

    }
    const token = getCookie('token');

    const res = await fetch("/api/user/appointments", {
        headers: { "Authorization": `Bearer ${token}` }
    });
     
    const data = await res.json();
    console.log(res)
    if (!res.ok) {
        alert("Error loading appointments");
        return;
    }

    const { appointments } = data;
    const container = document.getElementById("appointments-list");

    appointments.forEach(appt => {
        const item = document.createElement("div");
        item.className = "list-group-item";

        const time = new Date(appt.appointmentTime).toLocaleString("en-US");

        let otherPerson = "";
        if (role === "customer") {
            otherPerson = `<p>Technician: ${appt.technician.name} | ${appt.technician.phone}</p>`;
        } else if (role === "technician") {
            otherPerson = `<p>Customer: ${appt.customer.name} | ${appt.customer.phone}</p>`;
        }
    
        console.log(appt)
        var warr=""
        if(appt.request.warranty){
            warr= "this request is under warranty"
        }
        let html = `
            <h5>Request Details</h5>
        <p>Description: ${appt.request.description || '---'}</p>
        <p>Location: ${appt.request.location || '---'}</p>
        ${otherPerson}
        <div class="appointment-info">
            <p>Date: ${time}</p>
            <p>Status: <span class="status-badge status-${appt.status}">${appt.status}</span></p>
            <p>${warr}</p>
        </div>
        `;
        

        if (role === "customer" && appt.status === "scheduled" && !appt.feedbackGiven) {
            html += `<br><button class="btn-complete" data-id="${appt._id}">Mark as Completed</button>`;
        }

        item.innerHTML = html;
        container.appendChild(item);
    });

    container.addEventListener("click", e => {
        if (e.target.classList.contains("btn-complete")) {
            selectedAppointmentId = e.target.dataset.id;
            $('#feedbackModal').modal('show');
        }
    });

    document.getElementById("submit-feedback").addEventListener("click", async () => {
        const feedback = document.getElementById("feedback-text").value.trim();
        const rating = selectedRating;

        if (!feedback) {
            alert("Please enter your feedback");
            return;
        }

        const res = await fetch("/api/user/complete-appointment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                appointmentId: selectedAppointmentId,
                feedback,
                rating
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Appointment marked as completed and feedback submitted ✅");
            location.reload();
        } else {
            alert(`Error: ${data.message}`);
        }
    });



    const events = appointments.map(appt => {
        return {
            title: appt.request.description || 'No description',
            start: new Date(appt.appointmentTime).toISOString(),
            end: new Date(appt.appointmentTime).toISOString(),  
            description: appt.request.description,
            location: appt.request.location,
            status: appt.status,
            otherPerson: role === "customer" ? `Technician: ${appt.technician.name}` : `Customer: ${appt.customer.name}`
        };
    });

    $('#calendar').fullCalendar({
        events: events,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventClick: function(event) {
            alert('Description: ' + event.description + '\nLocation: ' + event.location);
        }
    });


     







});



let selectedRating = 0;
const stars = document.querySelectorAll('.rating-stars .star');

stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        stars.forEach(s => s.classList.remove('hovered'));
        const val = parseInt(star.dataset.value);
        for (let i = 0; i < val; i++) {
            stars[i].classList.add('hovered');
        }
    });

    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        stars.forEach(s => s.classList.remove('selected'));
        for (let i = 0; i < selectedRating; i++) {
            stars[i].classList.add('selected');
        }
    });

    star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hovered'));
    });
});

document.getElementById("submit-feedback").addEventListener("click", () => {
    const rating = selectedRating;
});
