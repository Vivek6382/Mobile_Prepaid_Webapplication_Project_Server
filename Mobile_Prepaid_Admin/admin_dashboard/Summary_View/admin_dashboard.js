// Pie Chart for Expiring Customer-Plans
const ctx = document.getElementById('expiringPlansChart').getContext('2d');

const expiringPlansChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Expiring in 3 Days', 'Expired', 'Active'],
        datasets: [{
            data: [40, 10, 50],
            backgroundColor: ['yellow', 'red', 'green'],
            borderWidth: 2,
            hoverOffset: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: 10
        },
        plugins: {
            legend: { display: false }, // Custom legend used instead
            tooltip: {
                backgroundColor: "#2b2b2b",
                bodyColor: "white",
                titleColor: "orangered",
                padding: 10
            }
        }
    }
});


// Bar Chart: Most Preferred Plan Packs
const barCtx = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['True 5G Unlimited Plans', 'Entertainment Plans', 'Data Booster', 'Annual Plans', 'International Roaming'],
        datasets: [{
            label: 'Customer Preference (%)',
            data: [60, 50, 40, 30, 20], // These values are in percentage
            backgroundColor: ['#FF5733', '#FF5733', '#FF5733', '#FF5733', '#FF5733'], // Same color for all bars
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                    callback: function(value) {
                        return value + '%'; // Adding percentage sign on the y-axis
                    }
                },
                title: {
                    display: true,
                    text: 'Customer Preference (%)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Plan Category'
                }
            }
        },
        elements: {
            bar: {
                borderWidth: 1,
                borderRadius: 5, // Slight rounding for bars
                categoryPercentage: 0.6, // Reducing the width of each bar slightly
                barPercentage: 0.8 // Reduces the bar's width
            }
        }
    }
});

// Line Chart: User Growth Over Time (Last 6 Months)
const lineCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Updated for 6 months
        datasets: [{
            label: 'User Growth Trend (Last 6 Months)', // Updated label
            data: [1200, 1500, 1800, 2000, 2500, 3000], // Example data (number of users)
            borderColor: 'orangered',
            backgroundColor: 'rgba(255, 69, 0, 0.2)',
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Users'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        }
    }
});



//KPI Cards: Revenue Summary

document.querySelector('.kpi-container .kpi-card:nth-child(1) .kpi-value').textContent = "₹" + updatedRevenueThisMonth;
document.querySelector('.kpi-container .kpi-card:nth-child(2) .kpi-value').textContent = "₹" + updatedTotalRevenue;
document.querySelector('.kpi-container .kpi-card:nth-child(3) .kpi-value').textContent = "₹" + updatedRevenuePrepaid;
document.querySelector('.kpi-container .kpi-card:nth-child(4) .kpi-value').textContent = updatedIncreaseDecreasePercentage + "%";

// Similarly for performance signals
document.querySelector('.kpi-container .kpi-card:nth-child(1) .kpi-performance').textContent = "+5%"; // Dynamic Signal Update
