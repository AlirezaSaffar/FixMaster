function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
const token = getCookie('token');
const role = getCookie('role');

if(role !=='technician'){
  if(!role){        window.location.href='/login'
  }else{
     window.location.href='/'
  }
  
}

async function submitOffer(requestId, button) {
  const card = button.closest(".request-card");
  const priceInput = card.querySelector("input[type='number']");
  const messageInput = card.querySelector("textarea");
  const timeinput = card.querySelector("input[type='datetime-local']");

  const price = priceInput.value.trim();
  const message = messageInput.value.trim();
  const time = timeinput.value.trim();
  console.log(time)

  if (!price) {
      alert("Please enter your offer price.");
      return;
  }

  button.disabled = true;
  button.textContent = "Submitting...";

  try {
      const res = await fetch(`/api/user/offer/${requestId}`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({
              price: Number(price),
              message: message,
              time:time
          })
      });

      const data = await res.json();

      if (data.success) {
          alert("Your offer has been submitted successfully!");
          priceInput.value = "";
          messageInput.value = "";
      } else {
          alert(data.message || "Failed to submit offer.");
      }
  } catch (err) {
      console.error("Error submitting offer:", err);
      alert("An error occurred while submitting your offer.");
  } finally {
      button.disabled = false;
      button.textContent = "Submit Here";
  }
}



async function fetchRequests() {
  try {
    const res = await fetch('/api/user/requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    const container = document.getElementById('requests-container');
    container.innerHTML = '';

    if (!data.success || !data.requests || data.requests.length === 0) {
      container.innerHTML = `<p>No requests found.</p>`;
      return;
    }

    data.requests.forEach(req => {
      const card = document.createElement('div');
      card.className = 'request-card';
      var warranty= "not"
      if(req.warranty){
        warranty=""
      }

      card.innerHTML = `
        <div class="request-title">${req.service || "No Title"}</div>
        <div class="request-meta">${req.location || "No Location"}</div>
        <p>${req.description || ""}</p>
        <div class="request-images">
          ${req.images && req.images.length > 0 
            ? req.images.map(img => `<img src="${img}" alt="Request Image">`).join("")
            : `<span style="color:#999;">No images</span>`}
        </div>
        <p>this request is ${warranty || ""} under warranty </p>
        <div class="offer-container">
          <input type="number" placeholder="Enter your offer" min="1" />
          <label for="timeEstimate">Meeting Time:</label>
<input type="datetime-local" id="timeEstimate" required>
          <textarea placeholder="Your message to the customer" rows="3" maxlength="500"></textarea>

        <button onclick="submitOffer('${req._id}', this)">Submit Offer</button>

      </div>
        <div class="message"></div>
      `;

     
      container.appendChild(card);
    });

  } catch (err) {
    document.getElementById('requests-container').innerHTML = `<p>Error loading data.</p>`;
  }
}

fetchRequests();
