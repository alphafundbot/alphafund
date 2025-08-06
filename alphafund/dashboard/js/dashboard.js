// AlphaFund Trading Platform Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Initialize charts
  initializeCharts();
  
  // Update the time every second
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Set up navigation
  setupNavigation();
  
  // Set up refresh button
  document.querySelector('.refresh-data').addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    
    // Simulate data refresh
    setTimeout(() => {
      loadSignals();
      this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
      showNotification('Data refreshed successfully', 'success');
    }, 1000);
  });
  
  // Load signals initially
  loadSignals();
});

// Load signals from Signal Mesh
function loadSignals() {
  fetch('/signals')
    .then(response => response.json())
    .then(signals => {
      // Update the signals count
      document.querySelector('.signal-count .big-number').textContent = signals.length;
      
      // Count signal types
      const infoCount = signals.filter(s => s.type === 'info' || s.severity === 'INFO').length;
      const warningCount = signals.filter(s => s.type === 'warning' || s.severity === 'WARNING').length;
      const errorCount = signals.filter(s => s.type === 'error' || s.severity === 'ERROR').length;
      
      document.querySelector('.signal-type.info').innerHTML = 
        `${infoCount} <i class="fas fa-info-circle"></i>`;
      document.querySelector('.signal-type.warning').innerHTML = 
        `${warningCount} <i class="fas fa-exclamation-triangle"></i>`;
      document.querySelector('.signal-type.error').innerHTML = 
        `${errorCount} <i class="fas fa-times-circle"></i>`;
    })
    .catch(error => {
      console.error('Error loading signals:', error);
      // Use default values if signals can't be loaded
    });
}

// Update date and time
function updateDateTime() {
  const now = new Date();
  document.getElementById('current-datetime').textContent = 
    now.toISOString().replace('T', ' ').substring(0, 19);
}

// Initialize charts
function initializeCharts() {
  const ctx = document.getElementById('price-chart').getContext('2d');
  
  // Generate sample data
  const labels = [];
  const data = [];
  
  // Create 30 days of sample data
  const now = new Date();
  let price = 455.72; // Starting price for NVDA
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    labels.push(date.toISOString().split('T')[0]);
    
    // Random price movement
    price = price * (1 + (Math.random() - 0.45) * 0.02);
    data.push(price);
  }
  
  // Create the chart
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'NVDA Price',
        data: data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxTicksLimit: 10
          }
        }
      }
    }
  });
}

// Set up navigation
function setupNavigation() {
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target section
      const targetId = this.getAttribute('href').substring(1);
      
      // Hide all sections
      document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Show the target section
      document.getElementById(targetId).classList.add('active');
      
      // Update active nav item
      document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.classList.remove('active');
      });
      this.parentElement.classList.add('active');
    });
  });
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'white';
  notification.style.padding = '15px 20px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
  notification.style.zIndex = '9999';
  notification.style.minWidth = '300px';
  notification.style.animation = 'fadeIn 0.3s ease-out forwards';
  
  if (type === 'success') {
    notification.style.borderLeft = '4px solid #10b981';
  } else {
    notification.style.borderLeft = '4px solid #3b82f6';
  }
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center;">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}" 
         style="margin-right: 10px; color: ${type === 'success' ? '#10b981' : '#3b82f6'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles for animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
  
  // Add to body
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-in forwards';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}
