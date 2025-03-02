// Register the Data Labels Plugin
const barCtx = document.getElementById('barChart').getContext('2d');

const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: [
            'Popular Plans', 'True 5G Unlimited Plans', 'True Unlimited Upgrade', 
            'Entertainment Plans', 'Data Booster', 'Annual Plans', 'International Roaming', 
            'ISD', 'In-Flight Packs', 'Top-up', 'Value Packs', 'Data Packs', 
            'Individual Plans', 'Cricket Plans'
        ],
        datasets: [{
            label: 'Customer Preference (%)',
            data: [80, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15], // Sample values
            backgroundColor: '#FF5733', // Single color for all bars
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Allows chart to take full space
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                    callback: function(value) {
                        return value + '%'; // Adds percentage sign on y-axis
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
                },
                ticks: {
                    autoSkip: false, // Ensures all labels are shown
                    maxRotation: 45, // Slightly rotates labels to fit
                    minRotation: 45
                }
            }
        },
        elements: {
            bar: {
                borderWidth: 1,
                borderRadius: 5, // Slight rounding for bars
                categoryPercentage: 0.7, // Adjusts bar width
                barPercentage: 0.9 // Ensures bars are properly spaced
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







document.addEventListener("DOMContentLoaded", function () {
    const deletePopup = document.getElementById("delete-popup");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    const cancelDeleteBtn = document.getElementById("cancel-delete");

    // Pop-up details elements
    const popupCategorySpan = document.getElementById("popup-plan-category");
    const popupTotalPlansSpan = document.getElementById("popup-total-plans");
    const popupSubscribersSpan = document.getElementById("popup-subscribers");
    const popupRevenueSpan = document.getElementById("popup-revenue");

    let currentCard = null;

    // Ensure pop-up is hidden initially
    deletePopup.style.display = "none";

    // Function to show the delete pop-up with details
    function openDeletePopup(cardElement) {
        if (!cardElement) return;

        currentCard = cardElement;

        // Fetch and display details dynamically in the pop-up
        popupCategorySpan.innerText = cardElement.querySelector(".plan-category")?.innerText || "N/A";
        popupTotalPlansSpan.innerText = cardElement.querySelector(".total-plans")?.innerText || "N/A";
        popupSubscribersSpan.innerText = cardElement.querySelector(".subscribed-users")?.innerText || "N/A";
        popupRevenueSpan.innerText = cardElement.querySelector(".revenue-generated")?.innerText || "N/A";

        // Show the pop-up
        deletePopup.style.display = "flex";
    }

    // Event listener for delete icon click
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-icon")) {
            const card = event.target.closest(".cust_manage_card");
            if (card) {
                openDeletePopup(card);
            }
        }
    });

    // Confirm delete: Remove plan category card
    confirmDeleteBtn.addEventListener("click", function () {
        if (currentCard) {
            currentCard.remove(); // Remove the card from the DOM
            currentCard = null;
        }
        deletePopup.style.display = "none"; // Close the pop-up
    });

    // Cancel delete action
    cancelDeleteBtn.addEventListener("click", function () {
        deletePopup.style.display = "none";
        currentCard = null;
    });
});







//Update-JS

document.addEventListener("DOMContentLoaded", function () {
    const updatePopup = document.getElementById("update-popup");
    const updatePlanBtn = document.getElementById("update-plan-btn");
    const cancelUpdateBtn = document.getElementById("cancel-update");

    const statusSelect = document.getElementById("status-dot");
    const planCategoryInput = document.getElementById("update-plan-category");

    let currentCard = null;

    updatePopup.style.display = "none";

    // Open update popup when clicking the edit icon
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-icon")) {
            const card = event.target.closest(".cust_manage_card");
            if (card) {
                openUpdatePopup(card);
            }
        }
    });

    function openUpdatePopup(cardElement) {
        currentCard = cardElement;

        const planCategory = currentCard.querySelector(".plan-category");

        // Determine current status from class
        if (currentCard.classList.contains("suspended")) {
            statusSelect.value = "suspended";
        } else if (currentCard.classList.contains("active")) {
            statusSelect.value = "active";
        }

        // Set plan category input field
        planCategoryInput.value = planCategory.textContent;

        updatePopup.style.display = "flex";
    }

    // Close update popup
    cancelUpdateBtn.addEventListener("click", function () {
        updatePopup.style.display = "none";
        currentCard = null;
    });

    // Apply updates when clicking update button
    updatePlanBtn.addEventListener("click", function () {
        if (currentCard) {
            const statusDot = currentCard.querySelector(".status-dot");
            const planCategory = currentCard.querySelector(".plan-category");

            // Remove all status classes before applying a new one
            currentCard.classList.remove("expired", "active", "suspended");

            let tooltipText = "";

            // Apply new status
            if (statusSelect.value === "suspended") {
                currentCard.classList.add("suspended"); // Use "suspended" instead of "expired"
                statusDot.style.backgroundColor = "red";
                tooltipText = "Suspended";
            } else if (statusSelect.value === "active") {
                currentCard.classList.add("active");
                statusDot.style.backgroundColor = "green";
                tooltipText = "Active";
            }

            // Update tooltip text dynamically
            statusDot.setAttribute("data-tooltip", tooltipText);

            // Update only the plan category
            planCategory.textContent = planCategoryInput.value;

            // Refresh the UI to reflect the updated category
            categorizeCustomers(document.querySelector(".active-nav")?.dataset.category || "all-category");
        }

        updatePopup.style.display = "none";
    });

    // Function to filter customers (ensures updated cards move to correct category)
    function categorizeCustomers(categoryClass) {
        document.querySelectorAll(".cust_manage_card").forEach((card) => {
            card.style.display =
                categoryClass === "all-category" || card.classList.contains(categoryClass) ? "flex" : "none";
        });
    }
});





// Add-pop-up-js


document.addEventListener("DOMContentLoaded", function () {
    const addPopup = document.getElementById("add-popup");
    const addCustomerBtn = document.getElementById("add-customer-btn");
    const cancelAddBtn = document.getElementById("cancel-add");
    const addButton = document.querySelector(".outline-button:nth-child(1)");

    // Get input fields
    const statusSelect = document.getElementById("add-status-dot");
    const customerMobileInput = document.getElementById("add-customer-mobile");
    const customerNameInput = document.getElementById("add-customer-name");
    const customerPlanInput = document.getElementById("add-customer-plan");
    const customerEmailInput = document.getElementById("add-customer-email");
    const subscriptionStartInput = document.getElementById("add-subscription-start");
    const subscriptionEndInput = document.getElementById("add-subscription-end");
    const billingAmountInput = document.getElementById("add-billing-amount");
    const lastPaymentInput = document.getElementById("add-last-payment");

    const cardsContainer = document.querySelector(".cust_manage_cards_container");

    // Open Add Pop-up
    addButton.addEventListener("click", function () {
        addPopup.style.display = "flex";
    });

    // Close Add Pop-up
    cancelAddBtn.addEventListener("click", function () {
        addPopup.style.display = "none";
    });

    // Function to attach tooltip events
    function attachTooltipEvents() {
        document.querySelectorAll(".status-dot").forEach(dot => {
            dot.addEventListener("mouseenter", function () {
                let tooltip = document.createElement("div");
                tooltip.classList.add("dynamic-tooltip");
                tooltip.innerText = this.getAttribute("data-tooltip");

                document.body.appendChild(tooltip);

                let rect = this.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 30}px`; // Position above the dot
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
            });

            dot.addEventListener("mouseleave", function () {
                document.querySelectorAll(".dynamic-tooltip").forEach(tip => tip.remove());
            });
        });
    }

    

    // Add Customer Card
    addCustomerBtn.addEventListener("click", function () {
        const mobileNumber = customerMobileInput.value.trim();
        const customerName = customerNameInput.value.trim();
        const customerPlan = customerPlanInput.value.trim();
        const customerEmail = customerEmailInput.value.trim();
        const subscriptionStart = subscriptionStartInput.value.trim();
        const subscriptionEnd = subscriptionEndInput.value.trim();
        const billingAmount = billingAmountInput.value.trim();
        const lastPayment = lastPaymentInput.value.trim();
        const status = statusSelect.value;

        if (!mobileNumber || !customerName || !customerPlan || !customerEmail || !subscriptionStart || !subscriptionEnd || !billingAmount || !lastPayment) {
            alert("Please fill in all fields.");
            return;
        }

        // Determine tooltip text based on selected status
        let tooltipText = status === "red" ? "Expired" : status === "yellow" ? "Expires Soon" : "Active";

        // Create a new customer card
        const newCard = document.createElement("div");
        newCard.classList.add("cust_manage_card", "all-category"); // Always in "All" category

        if (status === "red") {
            newCard.classList.add("expired");
        } else if (status === "yellow") {
            newCard.classList.add("expires-soon");
        } else {
            newCard.classList.add("active");
        }

        newCard.innerHTML = `
            <!-- Bulk Checkboxes -->
            <input type="checkbox" class="bulk-delete-checkbox">
            <input type="checkbox" class="bulk-update-checkbox">

            <!-- Delete Icon -->
            <i class="fa-solid fa-xmark delete-icon"></i>

            <!-- Status Dot -->
            <div class="dot_div">
                <span class="status-dot" style="background-color: ${status};" data-tooltip="${tooltipText}"></span>
            </div>

            <!-- Customer Details -->
            <div class="customer_info">

                <!-- Always Visible -->
                <div class="customer_mobile_div">
                    <span class="customer_mobile">${mobileNumber}</span>
                </div>
                <div class="customer_name_div">
                    <span class="customer_name">${customerName}</span>
                </div>
                <div class="customer_plan_div">
                    <span class="customer_plan">${customerPlan}</span>
                </div>

                <!-- Hidden Details -->
                <div class="customer_email_div hidden-details">
                    <span class="customer_email">${customerEmail}</span>
                </div>
                <div class="subscription_start_div hidden-details">
                    <span class="subscription_start">Start: ${subscriptionStart}</span>
                </div>
                <div class="subscription_end_div hidden-details">
                    <span class="subscription_end">End: ${subscriptionEnd}</span>
                </div>
                <div class="billing_amount_div hidden-details">
                    <span class="billing_amount">₹${billingAmount}</span>
                </div>
                <div class="last_payment_div hidden-details">
                    <span class="last_payment">Last Payment: ${lastPayment}</span>
                </div>
            </div>

            <!-- Card Footer -->
            <div class="cust_card_footer">
                <a href="#"><i class="fa-solid fa-eye view-details"></i></a>
                <i class="fa-solid fa-pen-to-square edit-icon"></i>
            </div>
        `;

        // Append to container
        cardsContainer.appendChild(newCard);

        // Re-apply event listeners to all status dots
        attachTooltipEvents();

        // Clear input fields
        customerMobileInput.value = "";
        customerNameInput.value = "";
        customerPlanInput.value = "";
        customerEmailInput.value = "";
        subscriptionStartInput.value = "";
        subscriptionEndInput.value = "";
        billingAmountInput.value = "";
        lastPaymentInput.value = "";

        // Close pop-up
        addPopup.style.display = "none";
    });

    // Attach event listeners on page load
    attachTooltipEvents();
});








document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.querySelector(".download_csv button");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            let allData = [
                ["Plan Category", "Total Plans", "Subscribers", "Revenue Generated", "Status"]
            ];
            let expiredData = [...allData];
            let activeData = [...allData];
            let expiringSoonData = [...allData];

            let customerCards = document.querySelectorAll(".cust_manage_card");

            customerCards.forEach(card => {
                let planCategory = card.querySelector(".plan-category")?.textContent.trim() || "N/A";
                let totalPlans = card.querySelector(".total-plans")?.textContent.trim() || "N/A";
                let subscribers = card.querySelector(".subscribed-users")?.textContent.trim() || "N/A";
                let revenueGenerated = card.querySelector(".revenue-generated")?.textContent.trim() || "N/A";

                let planStatus = "Active"; // Default Status
                if (card.classList.contains("suspended")) {
                    planStatus = "Expired";
                } else if (card.classList.contains("expiring-soon")) {
                    planStatus = "Expires Soon";
                }

                let rowData = [planCategory, totalPlans, subscribers, revenueGenerated, planStatus];
                allData.push(rowData);

                if (planStatus === "Expired") {
                    expiredData.push(rowData);
                } else if (planStatus === "Expires Soon") {
                    expiringSoonData.push(rowData);
                } else {
                    activeData.push(rowData);
                }
            });

            if (allData.length === 1) {
                alert("No plan data available for download!");
                return;
            }

            let workbook = XLSX.utils.book_new();

            function createSheet(data, sheetName) {
                if (data.length > 1) {
                    let sheet = XLSX.utils.aoa_to_sheet(data);
                    formatSheet(sheet);
                    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
                }
            }

            function formatSheet(sheet) {
                if (!sheet["!ref"]) return;
                const range = XLSX.utils.decode_range(sheet["!ref"]);

                for (let col = range.s.c; col <= range.e.c; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                    if (sheet[cellAddress]) {
                        sheet[cellAddress].s = {
                            font: { bold: true },
                            alignment: { horizontal: "center", vertical: "center" }
                        };
                    }
                }

                sheet["!cols"] = Array.from({ length: range.e.c + 1 }, () => ({ wch: 20 }));
            }

            createSheet(allData, "All Plans");
            createSheet(expiredData, "Expired Plans");
            createSheet(expiringSoonData, "Expiring Soon Plans");
            createSheet(activeData, "Active Plans");

            XLSX.writeFile(workbook, "Plan_Details.xlsx");
        });
    } else {
        console.error("Download button not found!");
    }
});














document.addEventListener("DOMContentLoaded", function () {
    let activeMode = null; // Tracks if delete or update is active

    /** ---------------- BULK DELETE ---------------- **/
    const deleteButton = document.querySelector(".delete-action");
    const deleteCheckboxes = document.querySelectorAll(".bulk-delete-checkbox");
    const bulkDeletePanel = document.querySelector(".bulk-delete-panel");
    const deleteSelectedButton = document.querySelector(".delete-selected");
    const cancelDeleteButton = document.querySelector(".cancel-action");

    deleteButton.addEventListener("click", function () {
        if (activeMode === "update") return; // Prevent action if update is active

        activeMode = "delete"; // Set delete mode active
        deleteCheckboxes.forEach(checkbox => checkbox.style.display = "inline-block");
    });

    deleteCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const anyChecked = [...deleteCheckboxes].some(cb => cb.checked);
            bulkDeletePanel.style.bottom = anyChecked ? "0" : "-60px";
        });
    });

    deleteSelectedButton.addEventListener("click", function () {
        deleteCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.closest(".cust_manage_card").remove();
            }
        });

        resetBulkActions();
    });

    cancelDeleteButton.addEventListener("click", function () {
        resetBulkActions();
    });

    /** ---------------- BULK UPDATE ---------------- **/
    const updateButton = document.querySelector(".bulk-update-trigger");
    const updateCheckboxes = document.querySelectorAll(".bulk-update-checkbox");
    const bulkUpdatePanel = document.querySelector(".bulk-update-panel");
    const updateSelectedButton = document.querySelector(".update-selected");
    const cancelUpdateButton = document.querySelector(".cancel-update-action");

    const updatePopup = document.getElementById("update-popup");
    const updatePlanBtn = document.getElementById("update-plan-btn");
    const cancelUpdateBtn = document.getElementById("cancel-update");

    const statusSelect = document.getElementById("status-dot");
    const planCategoryInput = document.getElementById("update-plan-category");

    let selectedUpdateCards = [];

    updateButton.addEventListener("click", function () {
        if (activeMode === "delete") return; // Prevent action if delete is active

        activeMode = "update"; // Set update mode active
        updateCheckboxes.forEach(checkbox => checkbox.style.display = "inline-block");
    });

    updateCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            selectedUpdateCards = [...updateCheckboxes].filter(cb => cb.checked).map(cb => cb.closest(".cust_manage_card"));
            bulkUpdatePanel.style.bottom = selectedUpdateCards.length > 0 ? "0" : "-60px";
        });
    });

    updateSelectedButton.addEventListener("click", function () {
        if (selectedUpdateCards.length === 0) return;

        // Retrieve values from the first selected card
        const firstCard = selectedUpdateCards[0];
        const firstStatus = firstCard.querySelector(".status-dot").classList;
        const firstPlanCategory = firstCard.querySelector(".plan-category").textContent;

        let allSameStatus = selectedUpdateCards.every(card => card.querySelector(".status-dot").classList.value === firstStatus.value);
        let allSamePlanCategory = selectedUpdateCards.every(card => card.querySelector(".plan-category").textContent === firstPlanCategory);

        statusSelect.value = allSameStatus ? (firstStatus.contains("suspended") ? "suspended" : "active") : "";
        planCategoryInput.value = allSamePlanCategory ? firstPlanCategory : "";

        updatePopup.style.display = "flex";
    });

    updatePlanBtn.addEventListener("click", function () {
        selectedUpdateCards.forEach(card => {
            const statusDot = card.querySelector(".status-dot");
            const planCategory = card.querySelector(".plan-category");

            card.classList.remove("suspended", "active");
            if (statusSelect.value === "suspended") {
                card.classList.add("suspended");
                statusDot.style.backgroundColor = "red";
            } else if (statusSelect.value === "active") {
                card.classList.add("active");
                statusDot.style.backgroundColor = "green";
            }

            if (planCategoryInput.value) planCategory.textContent = planCategoryInput.value;
        });

        updatePopup.style.display = "none";
        resetBulkActions();
    });

    cancelUpdateButton.addEventListener("click", function () {
        resetBulkActions();
    });

    cancelUpdateBtn.addEventListener("click", function () {
        updatePopup.style.display = "none";
    });

    /** ---------------- HELPER FUNCTION ---------------- **/
    function resetBulkActions() {
        activeMode = null; // Reset active mode

        // Hide checkboxes and panels
        deleteCheckboxes.forEach(checkbox => {
            checkbox.style.display = "none";
            checkbox.checked = false;
        });
        updateCheckboxes.forEach(checkbox => {
            checkbox.style.display = "none";
            checkbox.checked = false;
        });

        // Hide panels
        bulkDeletePanel.style.bottom = "-60px";
        bulkUpdatePanel.style.bottom = "-60px";
    }
});







// Filter-Navigation-Add-JS


document.addEventListener("DOMContentLoaded", function () {
    // Navigation elements
    const allNav = document.querySelector(".all_list a");
    const suspendedNav = document.querySelector(".suspended_list a");
    const activeNav = document.querySelector(".active_list a");
    const navLinks = document.querySelectorAll(".expires_list a");

    // Customer cards container
    const customerCardsContainer = document.querySelector(".cust_manage_cards_container");

    // Function to filter customers
    function categorizeCustomers(categoryClass, event) {
        document.querySelectorAll(".cust_manage_card").forEach((card) => {
            card.style.display = categoryClass === "all-category" || card.classList.contains(categoryClass) ? "flex" : "none";
        });

        navLinks.forEach((link) => link.classList.remove("active-nav"));
        event?.target.closest("a")?.classList.add("active-nav");
    }

    // Event Listeners
    allNav.addEventListener("click", (e) => { e.preventDefault(); categorizeCustomers("all-category", e); });
    suspendedNav.addEventListener("click", (e) => { e.preventDefault(); categorizeCustomers("suspended", e); });
    activeNav.addEventListener("click", (e) => { e.preventDefault(); categorizeCustomers("active", e); });

    // Add Customer Pop-up functionality
    const addPopup = document.getElementById("add-popup");
    const addCustomerBtn = document.getElementById("add-plan-btn");
    const cancelAddBtn = document.getElementById("cancel-add");

    document.querySelector(".outline-button:nth-child(1)")?.addEventListener("click", () => {
        addPopup.style.display = "flex";
    });

    cancelAddBtn.addEventListener("click", () => {
        addPopup.style.display = "none";
    });

    // Function to add a new customer
    addCustomerBtn.addEventListener("click", function () {
        const status = document.getElementById("add-status-dot").value;
        const planCategory = document.getElementById("add-plan-category").value;

        if (!planCategory) {
            alert("Please enter a Plan Category!");
            return;
        }

        const newCustomer = document.createElement("div");
        newCustomer.classList.add("cust_manage_card", status);
        newCustomer.innerHTML = `
            <div class="dot_div">
                <span class="status-dot" data-tooltip="${status.charAt(0).toUpperCase() + status.slice(1)}"></span>
            </div>
            <div class="bulk-actions">
                <input type="checkbox" class="bulk-delete-checkbox">
                <input type="checkbox" class="bulk-update-checkbox">
            </div>
            <i class="fa-solid fa-xmark delete-icon"></i>
            <div class="customer_info">
                <div class="customer_info_row">
                    <div class="customer_mobile_div">
                        <span class="customer_mobile">Category: <span class="plan-category">${planCategory}</span></span>
                    </div>
                    <div class="customer_name_div">
                        <span class="customer_name">Total Plans: <span class="total-plans">0</span></span>
                    </div>
                </div>
                <div class="customer_info_row">
                    <div class="customer_plan_div">
                        <span class="customer_plan">Subscribers: <span class="subscribed-users">0</span></span>
                    </div>
                    <div class="customer_email_div hidden-details">
                        <span class="customer_email">Revenue: ₹<span class="revenue-generated">0</span></span>
                    </div>
                </div>
            </div>
            <div class="cust_card_footer">
                <a href="#"><i class="fa-solid fa-eye view-details"></i></a>
                <i class="fa-solid fa-pen-to-square edit-icon"></i>
            </div>
            <div class="chevron-icon">
                <i class="fa fa-chevron-right"></i>
            </div>
        `;

        customerCardsContainer.appendChild(newCustomer);
        attachTooltipEvents();
        addPopup.style.display = "none";
    });

    // Attach tooltip events
    function attachTooltipEvents() {
        document.querySelectorAll(".status-dot").forEach(dot => {
            dot.addEventListener("mouseenter", function () {
                let tooltip = document.createElement("div");
                tooltip.classList.add("dynamic-tooltip");
                tooltip.innerText = this.getAttribute("data-tooltip");
                document.body.appendChild(tooltip);

                let rect = this.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 30}px`;
                tooltip.style.visibility = "visible";
                tooltip.style.opacity = "1";
            });

            dot.addEventListener("mouseleave", function () {
                document.querySelectorAll(".dynamic-tooltip").forEach(tip => tip.remove());
            });
        });
    }

    attachTooltipEvents();
});








//Status-dot

document.querySelectorAll(".status-dot").forEach(dot => {
    dot.addEventListener("mouseenter", function () {
        let tooltip = document.createElement("div");
        tooltip.classList.add("dynamic-tooltip");
        tooltip.innerText = this.getAttribute("data-tooltip");

        document.body.appendChild(tooltip);

        let rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 30}px`; // Position above the dot
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
    });

    dot.addEventListener("mouseleave", function () {
        document.querySelectorAll(".dynamic-tooltip").forEach(tip => tip.remove());
    });
});






// Filter-Button-Js
document.addEventListener("DOMContentLoaded", function () {
    const filterPopup = document.getElementById("filter-popup");
    const filterButton = document.getElementById("filterBtn");
    const closeButton = document.getElementById("close-popup");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const clearFiltersBtn = document.getElementById("clear-filters");
    const checkboxes = document.querySelectorAll(".filter-checkbox");
    const allNavTab = document.querySelector(".all_list"); // Selecting "All" tab correctly
    const customerCards = document.querySelectorAll(".cust_manage_card");

    // Open Filter Pop-up
    filterButton.addEventListener("click", function () {
        filterPopup.style.display = "flex";
    });

    // Close Pop-up Function
    function closePopup() {
        filterPopup.style.display = "none";
    }

    // Close Pop-up on clicking "X"
    closeButton.addEventListener("click", closePopup);

    // Clear All Filters
    clearFiltersBtn.addEventListener("click", function () {
        checkboxes.forEach(checkbox => checkbox.checked = false);
        customerCards.forEach(card => card.style.display = "block"); // Show all customers
        allNavTab.click(); // Select "All" navigation automatically
        closePopup();
    });

    // Apply Filters
    applyFiltersBtn.addEventListener("click", function () {
        let selectedFilters = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFilters.push(checkbox.value);
            }
        });

        if (selectedFilters.length === 0) {
            customerCards.forEach(card => card.style.display = "block"); // Show all if no filter
        } else {
            customerCards.forEach(card => {
                let matches = selectedFilters.some(filter => card.classList.contains(filter));
                card.style.display = matches ? "block" : "none";
            });
        }

        allNavTab.click(); // Ensure "All" navigation is selected
        closePopup(); // Close pop-up but filtering remains
    });
});







// Inside-Search-Js
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".tool_search input");
    const allNav = document.querySelector(".all_list a");
    const navLinks = document.querySelectorAll(".expires_list a"); // All category links

    // Function to reset category to "All"
    function resetToAllCategory() {
        navLinks.forEach((link) => link.classList.remove("active-nav"));
        allNav.classList.add("active-nav"); // Select "All" category
    }

    // Function to filter customer cards based on search term
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const customerCards = document.querySelectorAll(".cust_manage_card"); // Fetch dynamically

        if (searchTerm === "") {
            // If search is cleared, reset to "All" category and show all cards
            resetToAllCategory();
            customerCards.forEach((card) => (card.style.display = "flex"));
            return;
        }

        let anyMatch = false;
        customerCards.forEach((card) => {
            const category = card.querySelector(".plan-category")?.textContent.toLowerCase() || "";
            const totalPlans = card.querySelector(".total-plans")?.textContent.toLowerCase() || "";
            const subscribers = card.querySelector(".subscribed-users")?.textContent.toLowerCase() || "";
            const revenue = card.querySelector(".revenue-generated")?.textContent.toLowerCase() || "";

            if (
                category.includes(searchTerm) ||
                totalPlans.includes(searchTerm) ||
                subscribers.includes(searchTerm) ||
                revenue.includes(searchTerm)
            ) {
                card.style.display = "flex"; // Show matching cards
                anyMatch = true;
            } else {
                card.style.display = "none"; // Hide non-matching cards
            }
        });

        if (anyMatch) {
            resetToAllCategory(); // Select "All" category when searching
        }
    }

    // Trigger search when typing
    searchInput.addEventListener("input", performSearch);

    // Trigger search when pressing Enter (prevent default form submission if inside a form)
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent any unintended form submission
            performSearch();
        }
    });

    // Monitor for newly added cards
    const observer = new MutationObserver(() => {
        performSearch(); // Reapply search when a new card is added
    });

    // Observe the parent container of customer cards
    const customerListContainer = document.querySelector(".customer_list"); // Adjust selector as needed
    if (customerListContainer) {
        observer.observe(customerListContainer, { childList: true });
    }
});










// ✅ Open Customer Details Pop-up

document.addEventListener("DOMContentLoaded", function () {
    const cardsContainer = document.querySelector(".cust_manage_cards_container");

    // ✅ Use Event Delegation for opening the customer details pop-up
    cardsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("view-details") || event.target.closest(".view-details")) {
            event.preventDefault();

            // Get the closest customer card
            let card = event.target.closest(".cust_manage_card");

            if (!card) return; // Safety check

            // Get customer details
            let status = card.querySelector(".status-dot").getAttribute("data-tooltip");
            let mobile = card.querySelector(".customer_mobile").innerText;
            let name = card.querySelector(".customer_name").innerText;
            let plan = card.querySelector(".customer_plan").innerText;
            let email = card.querySelector(".customer_email").innerText;
            let subscriptionStart = card.querySelector(".subscription_start").innerText;
            let subscriptionEnd = card.querySelector(".subscription_end").innerText;
            let billingAmount = card.querySelector(".billing_amount").innerText;
            let lastPayment = card.querySelector(".last_payment").innerText;

            // Update the pop-up content with correct IDs
            document.getElementById("detail-customer-status").textContent = status;
            document.getElementById("detail-customer-mobile").textContent = mobile;
            document.getElementById("detail-customer-name").textContent = name;
            document.getElementById("detail-customer-plan").textContent = plan;
            document.getElementById("detail-customer-email").textContent = email;
            document.getElementById("detail-subscription-start").textContent = subscriptionStart;
            document.getElementById("detail-subscription-end").textContent = subscriptionEnd;
            document.getElementById("detail-billing-amount").textContent = billingAmount;
            document.getElementById("detail-last-payment").textContent = lastPayment;

            // Show the pop-up
            document.getElementById("customer-details-popup").style.display = "flex";
        }
    });

    // ✅ Close Customer Details Pop-up (X button)
    document.getElementById("close-customer-popup").addEventListener("click", function () {
        document.getElementById("customer-details-popup").style.display = "none";
    });

    // ✅ Close Customer Details Pop-up (Close button)
    document.getElementById("close-details-popup").addEventListener("click", function () {
        document.getElementById("customer-details-popup").style.display = "none";
    });
});



