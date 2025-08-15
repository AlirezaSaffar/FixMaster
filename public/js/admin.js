

var ctx1 = document.getElementById('technicianCustomerChart').getContext('2d');
var technicianCustomerChart = new Chart(ctx1, {
  type: 'pie', 
  data: {
    labels: ['تعداد تکنسین‌ها', 'تعداد مشتری‌ها'], 
    datasets: [{
      label: 'تعداد تکنسین‌ها و مشتری‌ها',
      data: [], 
      backgroundColor: ['#FF6347', '#4A90E2'], 
      borderColor: ['#FF6347', '#4A90E2'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw;
          }
        }
      }
    }
  }
});

var ctx2 = document.getElementById('serviceChart').getContext('2d');
var serviceChart = new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه'], 
    datasets: [{
      label: 'خدمات تکمیل‌شده',
      data: [], 
      fill: false,
      borderColor: '#FF6347',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


async function loadStats() {
  const res = await fetch('/api/admin'); 
  const data = await res.json();

  document.getElementById('customerCount').innerText = data.customerusers;
  document.getElementById('technicianCount').innerText = data.technicianusers;
  document.getElementById('avgPrice').innerText = data.avgPrice.toLocaleString() + ' تومان';
  document.getElementById('maxPrice').innerText = data.maxPrice.toLocaleString() + ' تومان'; 
  document.getElementById('totalPayments').innerText = data.payments.toLocaleString() + ' تومان';
  document.getElementById('totalReviews').innerText = data.reviews; 
  document.getElementById('totalRequests').innerText = data.requests; 
  document.getElementById('totalOffers').innerText = data.offers;
  document.getElementById('inProgressServices').innerText = data.inProgressServices; 
  document.getElementById('completedServices').innerText = data.completedServices;
  document.getElementById('avgRating').innerText = data.avgrate.toFixed(3);
  document.getElementById('limit').innerText = data.limit;


  avgRating
  
  technicianCustomerChart.data.datasets[0].data = [data.technicianusers, data.customerusers];
  technicianCustomerChart.update();

  serviceChart.data.datasets[0].data = [
    data.completedServicesJan, 
    data.completedServicesFeb, 
    data.completedServicesMar, 
    data.completedServicesApr, 
    data.completedServicesMay
  ];
  serviceChart.update();
}

async function savePriceLimit() {
  const limit = document.getElementById('priceLimitInput').value;
  const response = await fetch(`/api/admin/setlimit?limit=${encodeURIComponent(limit)}`, {
    method: 'GET'
});


const data = await response.json();

alert("A new limit has been set.")
window.location.href="/admin"

}

loadStats(); 