// Main JavaScript file for FastAPI Static Website

document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.add('loading');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Health check functionality
    const healthCheckBtn = document.querySelector('a[href="/health"]');
    if (healthCheckBtn) {
        healthCheckBtn.addEventListener('click', function(e) {
            e.preventDefault();
            checkHealth();
        });
    }

    // Console welcome message
    console.log('%c🚀 FastAPI Static Website', 'color: #007bff; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt for CI/CD practice with Jenkins and Docker', 'color: #6c757d; font-size: 12px;');
});

// Health check function
async function checkHealth() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        
        if (data.status === 'healthy') {
            showNotification('✅ Application is healthy!', 'success');
        } else {
            showNotification('⚠️ Application status unknown', 'warning');
        }
    } catch (error) {
        showNotification('❌ Health check failed', 'danger');
        console.error('Health check error:', error);
    }
}

// Simple notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} custom-notification position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" aria-label="Close"></button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Add close functionality
    const closeBtn = notification.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

