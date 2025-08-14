function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
const role = getCookie('role');

if(role==='technician'){
    window.location.href='/'
}

if(!role){
     window.location.href='/login'
}
document.getElementById('logout-button')?.addEventListener('click', () => {
  document.cookie = 'token=; Max-Age=0; path=/'; 
  document.cookie = 'role=; Max-Age=0; path=/'; 
  window.location.href = '/login';
});
document.getElementById("repairForm").addEventListener("submit", async function(e) {

    
    e.preventDefault();

    const description = document.getElementById("description").value.trim();
    const location = document.getElementById("location").value.trim();
    const service = document.getElementById("service").value;
    const imagesInput = document.getElementById("images").files;

    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location);
    formData.append("service", service);

    for (let i = 0; i < imagesInput.length; i++) {
      formData.append("images", imagesInput[i]);
    }
    const token = getCookie('token');
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        body: formData ,
        headers: {
          'Authorization': `Bearer ${token}`,
      }
      });

      const data = await res.json();

      if (data.success) {
        document.getElementById("message").style.display = "block";
        document.getElementById("message").textContent = "Request submitted successfully!";
        document.getElementById("error").style.display = "none";
        document.getElementById("repairForm").reset();
      } else {
        document.getElementById("error").style.display = "block";
        document.getElementById("error").textContent = data.message || "Something went wrong.";
        document.getElementById("message").style.display = "none";
      }
    } catch (err) {
      document.getElementById("error").style.display = "block";
      document.getElementById("error").textContent = "Server error. Please try again.";
      document.getElementById("message").style.display = "none";
    }
  });