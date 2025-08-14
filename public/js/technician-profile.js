document.addEventListener("DOMContentLoaded", () => {
    const profileCard = document.getElementById('profile-card');
   
    

    const urlParams = new URLSearchParams(window.location.search);
    const technicianId = urlParams.get('id');

    if (!technicianId) {
        profileCard.innerHTML = '<p class="error-message">Invalid Technician ID.</p>';
        return;
    }

    fetch(`/api/auth/technician/${technicianId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const t = data.data;
                profileCard.innerHTML = `
                    <h2>${t.name}</h2>
                    <div class="profile-info">
                        <p><strong>Email:</strong> ${t.email}</p>
                        <p><strong>Phone:</strong> ${t.phone}</p>
                        <p><strong>City:</strong> ${t.city || '—'}</p>
                        <p><strong>Service:</strong> ${t.service || '—'}</p>
                        <p class="rating">⭐ Average Rating: ${t.averageRating}</p>
                    </div>
                    <a href="javascript:window.location.href = document.referrer" class="back-btn">← Back</a>


                    <div class="reviews-section">
                        <h3>Customer Reviews:</h3>
                        ${t.reviews.length > 0 ? 
                            t.reviews.map(review => `
                                <div class="review-card">
                                    <p><strong>${review.customer.name}:</strong></p>
                                    <p>Rating: ${review.rating} ⭐</p>
                                    <p>${review.comment}</p>
                                    <p><small>Posted on: ${new Date(review.createdAt).toLocaleDateString()}</small></p>
                                </div>
                            `).join('') : 
                            '<p>No reviews yet.</p>'
                        }
                    </div>
                `;
            } else {
                profileCard.innerHTML = `<p class="error-message">${data.message || 'Technician not found.'}</p>`;
            }
        })
        .catch(err => {
            console.error(err);
            profileCard.innerHTML = '<p class="error-message">Error loading profile. Please try again later.</p>';
        });
});
