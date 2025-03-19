// Admin Profile Dropdown JS

// Admin Profile Dropdown JS
document.addEventListener("DOMContentLoaded", function () {
    const adminUserDropdown = document.querySelector(".admin_user_dropdown");
    const adminUserIcon = document.getElementById("adminUserIcon");
    const adminDropdownContent = document.getElementById("adminDropdownContent");
    const adminSignOutBtn = document.getElementById("adminSignOutBtn");

    function handleAdminLogout(event) {
        event.preventDefault();
        sessionStorage.removeItem("currentCustomer"); // Remove session storage
        sessionStorage.removeItem("adminAccessToken"); // Remove admin token

        // Redirect to Admin Login after logout
        setTimeout(() => {
            window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
        }, 100);
    }

    function checkAdminAccess() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");
        const adminAccessToken = sessionStorage.getItem("adminAccessToken");

        // Redirect to Admin Login if not logged in
        if (!currentCustomer || !adminAccessToken) {
            window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            return;
        }
    }

    function updateAdminDropdown() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");
        const adminAccessToken = sessionStorage.getItem("adminAccessToken");

        // If logged in, allow dropdown functionality
        if (currentCustomer && adminAccessToken) {
            adminUserIcon.onclick = function (event) {
                event.stopPropagation();
                adminUserDropdown.classList.toggle("active"); // Toggle dropdown visibility
            };

            // Sign-out functionality
            if (adminSignOutBtn) {
                adminSignOutBtn.onclick = handleAdminLogout;
            }
        } else {
            // If not logged in, clicking the user icon redirects to Admin Login
            adminUserIcon.onclick = function () {
                window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
            };

            // Ensure dropdown is hidden
            adminUserDropdown.classList.remove("active");
        }
    }

    // Check if admin is logged in (Access Control)
    checkAdminAccess();

    // Initialize dropdown behavior
    updateAdminDropdown();

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!adminUserDropdown.contains(event.target)) {
            adminUserDropdown.classList.remove("active");
        }
    });

    // Redirect if session storage is cleared (security measure)
    window.addEventListener("storage", function () {
        if (!sessionStorage.getItem("currentCustomer") || !sessionStorage.getItem("adminAccessToken")) {
            window.location.href = "/Mobile_Prepaid_Admin/Admin_Login/admin_login.html";
        }
    });

    // Listen for login event and update dropdown dynamically
    window.addEventListener("storage", function () {
        if (sessionStorage.getItem("currentCustomer") && sessionStorage.getItem("adminAccessToken")) {
            updateAdminDropdown();
        }
    });
});






// Pie Chart for Expiring Customer-Plans
document.addEventListener("DOMContentLoaded", async function () {
    const usersEndpoint = "http://localhost:8083/api/users";
    const transactionsEndpoint = "http://localhost:8083/api/transactions";

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch data");
            return await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    function categorizeTransactions(users, transactions) {
        let active = 0, expired = 0, expiresSoon = 0;
        const today = new Date();

        users.forEach(user => {
            const userTransactions = transactions.filter(t => t.user.userId === user.userId);

            if (userTransactions.length === 0) {
                expired++;
                return;
            }

            userTransactions.sort((a, b) => new Date(b.planEnd) - new Date(a.planEnd));
            const latestTransaction = userTransactions[0];
            const planEnd = new Date(latestTransaction.planEnd);
            const daysRemaining = Math.ceil((planEnd - today) / (1000 * 60 * 60 * 24));

            if (planEnd < today) {
                expired++;
            } else if (daysRemaining <= 3) {
                expiresSoon++;
            } else {
                active++;
            }
        });

        return { active, expired, expiresSoon };
    }

    async function updateChart() {
        const [users, transactions] = await Promise.all([
            fetchData(usersEndpoint),
            fetchData(transactionsEndpoint)
        ]);
        const { active, expired, expiresSoon } = categorizeTransactions(users, transactions);

        const ctx = document.getElementById('expiringPlansChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Expiring in 3 Days', 'Expired', 'Active'],
                datasets: [{
                    data: [expiresSoon, expired, active],
                    backgroundColor: ['yellow', 'red', 'green'],
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: { padding: 10 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#2b2b2b",
                        bodyColor: "white",
                        titleColor: "orangered",
                        padding: 10
                    }
                }
            }
        });
    }

    await updateChart();
});




// Bar Chart: Most Preferred Plan Packs
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fetch data from backend endpoints
        const [categories, transactions] = await Promise.all([
            fetch("http://localhost:8083/api/categories").then(res => res.json()),
            fetch("http://localhost:8083/api/transactions").then(res => res.json())
        ]);

        // Prepare chart data
        let categoryCounts = categories.map(category => {
            const categoryId = category.categoryId;
            const categoryTransactions = transactions.filter(transaction => 
                transaction.plan.categories.some(cat => cat.categoryId === categoryId)
            );
            return {
                name: category.categoryName,
                count: categoryTransactions.length // Number of transactions as preference
            };
        });

        // Sort categories by preference count in descending order and get the top 5
        categoryCounts.sort((a, b) => b.count - a.count);
        categoryCounts = categoryCounts.slice(0, 5); // Top 5 categories

        // Extract labels and data
        const labels = categoryCounts.map(cat => cat.name);
        const data = categoryCounts.map(cat => cat.count);

        // Get canvas context
        const barCtx = document.getElementById('barChart').getContext('2d');

        // Create Bar Chart
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Customer Preference (Transactions)',
                    data: data,
                    backgroundColor: '#FF5733',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10,
                            callback: function(value) {
                                return value + ' Transactions';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Number of Transactions'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Plan Category'
                        },
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                elements: {
                    bar: {
                        borderWidth: 1,
                        borderRadius: 5,
                        categoryPercentage: 0.7,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    tooltip: {
                        backgroundColor: "#2b2b2b",
                        bodyColor: "white",
                        titleColor: "orangered",
                        padding: 10
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching data for bar chart:", error);
    }
});



// Line Chart: User Growth Over Time (Last 6 Months)
document.addEventListener("DOMContentLoaded", async () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; // Last 6 months

    // Fetch transactions
    const transactionsRes = await fetch("http://localhost:8083/api/transactions");
    const transactions = await transactionsRes.json();

    // Initialize monthly user count
    const monthlyUsers = {};
    months.forEach(month => (monthlyUsers[month] = 0));

    // Count users per month based on transaction start dates
    transactions.forEach(txn => {
        const txnDate = new Date(txn.planStart);
        const month = txnDate.toLocaleString('en-US', { month: 'short' });

        if (monthlyUsers[month] !== undefined) {
            monthlyUsers[month]++;
        }
    });

    // Convert monthlyUsers object into an array for the chart
    const userGrowthData = months.map(month => monthlyUsers[month]);

    // Register the chart and update it dynamically
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: months, // Only last 6 months
            datasets: [{
                label: 'User Growth Trend (Last 6 Months)',
                data: userGrowthData, // Dynamic data
                borderColor: 'orangered',
                backgroundColor: 'rgba(255, 69, 0, 0.2)',
                fill: true,
                tension: 0.3 // Smooth curve effect
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
});



//KPI Cards: Revenue Summary

document.querySelector('.kpi-container .kpi-card:nth-child(1) .kpi-value').textContent = "₹" + updatedRevenueThisMonth;
document.querySelector('.kpi-container .kpi-card:nth-child(2) .kpi-value').textContent = "₹" + updatedTotalRevenue;
document.querySelector('.kpi-container .kpi-card:nth-child(3) .kpi-value').textContent = "₹" + updatedRevenuePrepaid;
document.querySelector('.kpi-container .kpi-card:nth-child(4) .kpi-value').textContent = updatedIncreaseDecreasePercentage + "%";

// Similarly for performance signals
document.querySelector('.kpi-container .kpi-card:nth-child(1) .kpi-performance').textContent = "+5%"; // Dynamic Signal Update
