function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const token = getCookie('token');
  const role = getCookie('role');
  
  if(role !=='customer'){
    if(!role){        window.location.href='/login'
    }else{
       window.location.href='/'
    }
    
  }
  var statu =1
async function loadRequestDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');

    try {
        const requestRes = await fetch(`/api/user/request/${requestId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const requestData = await requestRes.json();
        console.log(requestData)

         statu= requestData.status

        document.getElementById('request-title').textContent = requestData.title;
        document.getElementById('request-description').textContent = requestData.description;
        if(requestData.warranty){
        document.getElementById('warr').textContent = "this request is under warranty";
        }else{


        }


        const imagesContainer = document.getElementById('request-images');
        imagesContainer.innerHTML = '';
        requestData.images.forEach(img => {
            const imageEl = document.createElement('img');
            imageEl.src = img;
            imagesContainer.appendChild(imageEl);
        });

        const offersRes = await fetch(`/api/user/request/${requestId}/offers`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const offersData = await offersRes.json();

        const offersContainer = document.getElementById('offers-container');
        offersContainer.innerHTML = '';

        if (offersData.length === 0) {
            offersContainer.innerHTML = '<p>No offers yet.</p>';
        } else {
            if(statu=="completed"){
                
                document.getElementById("h3offer").innerHTML= "the Appointment set"            
            
            }else{
            offersData.forEach(offer => {
                const card = document.createElement('div');
                card.className = 'offer-card';

                const info = document.createElement('div');
                info.className = 'offer-info';
                console.log(offer.timee)

                const time = new Date(offer.timee);

const iranOffset = 0;
const iranTime = new Date(time.getTime() + iranOffset);
console.log(iranTime)
if(offer.best){
    info.innerHTML = `
    <span class="technician"><a href="/technician-profile?id=${offer.technicianId}  " class="technician-link"> Technician: ${offer.technicianName} (offered) </a> </span>
   <span class="price">Price: $${offer.amount}</span>
    <span class="price">Time: $${iranTime}</span>
   <span class="message">"${offer.message}"</span>
`;

}else{
                info.innerHTML = `
                     <span class="technician"><a href="/technician-profile?id=${offer.technicianId}  " class="technician-link"> Technician: ${offer.technicianName} </a> </span>
                    <span class="price">Price: $${offer.amount}</span>
                     <span class="price">Time: $${iranTime}</span>
                    <span class="message">"${offer.message}"</span>
                `;
}
                const button = document.createElement('button');
                button.textContent = 'Accept Offer';
                button.onclick = () => acceptOffer(offer);

                card.appendChild(info);
                card.appendChild(button);
                offersContainer.appendChild(card);
            });
        }
        }

    } catch (err) {
        console.error(err);
        document.getElementById('request-title').textContent = 'Failed to load request';
    }
}

function acceptOffer(offer) {
    const query = new URLSearchParams({
        offerId: offer._id,
        amount: offer.amount,
        time: offer.timeEstimate
    }).toString();

    window.location.href = `/payment?${query}`;
}

loadRequestDetail();
