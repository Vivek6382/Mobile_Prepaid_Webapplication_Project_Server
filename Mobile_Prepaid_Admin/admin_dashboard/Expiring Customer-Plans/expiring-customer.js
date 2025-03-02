// Register the Data Labels Plugin
Chart.register(ChartDataLabels);

// Pie Chart for Expiring Customer Plans
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
        maintainAspectRatio: true,
        layout: {
            padding: 10
        },
        plugins: {
            legend: { 
                display: false, // Custom legend used instead
            },
            tooltip: {
                backgroundColor: "#2b2b2b",
                bodyColor: "white",
                titleColor: "orangered",
                padding: 10
            },
            // Enable Data Labels Plugin
            datalabels: {
                display: true,
                color: '#FF5733', // Label color
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: function(value, context) {
                    return `${context.chart.data.labels[context.dataIndex]} - ${value}%`; // Custom label format
                },
                anchor: 'end',  // Anchor the label at the end of each slice
                align: 'end', // Align the label to the outside of the slice
                offset: 10      // Adjust label offset to avoid overlap
            }
        }
    }
});






// Delete-pop-up-JS

document.addEventListener("DOMContentLoaded", function () {
    const deletePopup = document.getElementById("delete-popup");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    const cancelDeleteBtn = document.getElementById("cancel-delete");

    // Customer details in pop-up
    const customerNameSpan = document.getElementById("customer-name");
    const customerMobileSpan = document.getElementById("customer-mobile");
    const customerEmailSpan = document.getElementById("customer-email");
    const subscriptionStartSpan = document.getElementById("subscription-start");
    const subscriptionEndSpan = document.getElementById("subscription-end");
    const billingAmountSpan = document.getElementById("billing-amount");
    const lastPaymentSpan = document.getElementById("last-payment");
    const customerPlanSpan = document.getElementById("customer-plan");

    let currentCard = null;

    // Ensure pop-up is hidden initially
    deletePopup.style.display = "none";

    // Function to show the delete pop-up with details
    function openDeletePopup(cardElement) {
        if (!cardElement) return;

        currentCard = cardElement;

        // Debugging: Check if the right card is detected
        console.log("Opening pop-up for:", cardElement);

        // Fetch and display customer details in pop-up dynamically
        customerNameSpan.innerText = cardElement.querySelector(".customer_name")?.innerText || "N/A";
        customerMobileSpan.innerText = cardElement.querySelector(".customer_mobile")?.innerText || "N/A";
        customerPlanSpan.innerText = cardElement.querySelector(".customer_plan")?.innerText || "N/A";
        customerEmailSpan.innerText = cardElement.querySelector(".customer_email")?.innerText || "N/A";
        subscriptionStartSpan.innerText = cardElement.querySelector(".subscription_start")?.innerText.replace("Start: ", "") || "N/A";
        subscriptionEndSpan.innerText = cardElement.querySelector(".subscription_end")?.innerText.replace("End: ", "") || "N/A";
        billingAmountSpan.innerText = cardElement.querySelector(".billing_amount")?.innerText || "N/A";
        lastPaymentSpan.innerText = cardElement.querySelector(".last_payment")?.innerText.replace("Last Payment: ", "") || "N/A";

        // Show the pop-up
        deletePopup.style.display = "flex";
    }

    // Event listener for delete icon click
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-icon")) {
            console.log("Delete icon clicked!");

            const card = event.target.closest(".cust_manage_card");
            if (card) {
                console.log("Card found:", card);
                openDeletePopup(card);
            } else {
                console.log("No card found.");
            }
        }
    });

    // Confirm delete: Remove customer card
    confirmDeleteBtn.addEventListener("click", function () {
        if (currentCard) {
            console.log("Deleting card:", currentCard);
            currentCard.remove(); // Remove the card from the DOM
            currentCard = null;
        }
        deletePopup.style.display = "none"; // Close the pop-up
    });

    // Cancel delete action
    cancelDeleteBtn.addEventListener("click", function () {
        console.log("Delete canceled");
        deletePopup.style.display = "none";
        currentCard = null;
    });
});








// Update-pop-up-JS

// Update-pop-up-JS
document.addEventListener("DOMContentLoaded", function () {
    const updatePopup = document.getElementById("update-popup");
    const updateCustomerBtn = document.getElementById("update-customer");
    const cancelUpdateBtn = document.getElementById("cancel-update");

    const statusSelect = document.getElementById("status-dot");
    const customerMobileInput = document.getElementById("update-customer-mobile");
    const customerNameInput = document.getElementById("update-customer-name");
    const customerEmailInput = document.getElementById("update-customer-email");
    const subscriptionStartInput = document.getElementById("update-subscription-start");
    const subscriptionEndInput = document.getElementById("update-subscription-end");
    const billingAmountInput = document.getElementById("update-billing-amount");
    const lastPaymentInput = document.getElementById("update-last-payment");

    let currentCard = null;

    updatePopup.style.display = "none";

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

        const statusDot = currentCard.querySelector(".status-dot");
        const customerMobile = currentCard.querySelector(".customer_mobile");
        const customerName = currentCard.querySelector(".customer_name");
        const customerEmail = currentCard.querySelector(".customer_email");
        const subscriptionStart = currentCard.querySelector(".subscription_start");
        const subscriptionEnd = currentCard.querySelector(".subscription_end");
        const billingAmount = currentCard.querySelector(".billing_amount");
        const lastPayment = currentCard.querySelector(".last_payment");

        if (currentCard.classList.contains("expired")) {
            statusSelect.value = "red"; // Expired
        } else if (currentCard.classList.contains("expires-soon")) {
            statusSelect.value = "yellow"; // Expires Soon
        } else if (currentCard.classList.contains("active")) {
            statusSelect.value = "green"; // Active
        }

        customerMobileInput.value = customerMobile.textContent;
        customerNameInput.value = customerName.textContent;
        customerEmailInput.value = customerEmail ? customerEmail.textContent : "";
        subscriptionStartInput.value = subscriptionStart ? subscriptionStart.textContent.replace("Start: ", "") : "";
        subscriptionEndInput.value = subscriptionEnd ? subscriptionEnd.textContent.replace("End: ", "") : "";
        billingAmountInput.value = billingAmount ? billingAmount.textContent.replace("₹", "") : "";
        lastPaymentInput.value = lastPayment ? lastPayment.textContent.replace("Last Payment: ", "") : "";

        updatePopup.style.display = "flex";
    }

    cancelUpdateBtn.addEventListener("click", function () {
        updatePopup.style.display = "none";
        currentCard = null;
    });

    updateCustomerBtn.addEventListener("click", function () {
        if (currentCard) {
            const statusDot = currentCard.querySelector(".status-dot");
            const customerMobile = currentCard.querySelector(".customer_mobile");
            const customerName = currentCard.querySelector(".customer_name");
            const customerEmail = currentCard.querySelector(".customer_email");
            const subscriptionStart = currentCard.querySelector(".subscription_start");
            const subscriptionEnd = currentCard.querySelector(".subscription_end");
            const billingAmount = currentCard.querySelector(".billing_amount");
            const lastPayment = currentCard.querySelector(".last_payment");

            // Remove old status classes
            currentCard.classList.remove("expired", "expires-soon", "active");

            // Apply new status based on selection
            let tooltipText = "";
            if (statusSelect.value === "red") {
                currentCard.classList.add("expired");
                statusDot.style.backgroundColor = "red";
                tooltipText = "Expired";
            } else if (statusSelect.value === "yellow") {
                currentCard.classList.add("expires-soon");
                statusDot.style.backgroundColor = "yellow";
                tooltipText = "Expires Soon";
            } else if (statusSelect.value === "green") {
                currentCard.classList.add("active");
                statusDot.style.backgroundColor = "green";
                tooltipText = "Active";
            }

            // Update tooltip text dynamically
            statusDot.setAttribute("data-tooltip", tooltipText);

            customerMobile.textContent = customerMobileInput.value;
            customerName.textContent = customerNameInput.value;
            if (customerEmail) customerEmail.textContent = customerEmailInput.value;
            if (subscriptionStart) subscriptionStart.textContent = "Start: " + subscriptionStartInput.value;
            if (subscriptionEnd) subscriptionEnd.textContent = "End: " + subscriptionEndInput.value;
            if (billingAmount) billingAmount.textContent = "₹" + billingAmountInput.value;
            if (lastPayment) lastPayment.textContent = "Last Payment: " + lastPaymentInput.value;
        }
        updatePopup.style.display = "none";
    });
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








// Download-Csv-Js

document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.querySelector(".download_csv button");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            let allData = [
                ["Customer Name", "Mobile Number", "Customer Status", "Plan Selected", "Subscription Start", "Subscription End", "Billing Amount", "Last Payment"]
            ];
            let expiredData = [...allData];
            let expiresSoonData = [...allData];
            let activeData = [...allData];

            let customerCards = document.querySelectorAll(".cust_manage_card");

            customerCards.forEach(card => {
                let customerName = card.querySelector(".customer_name")?.textContent.trim() || "N/A";
                let mobileNumber = card.querySelector(".customer_mobile")?.textContent.trim() || "N/A";
                let planSelected = card.querySelector(".customer_plan")?.textContent.trim() || "N/A";
                let subscriptionStart = card.querySelector(".subscription_start")?.textContent.replace("Start: ", "").trim() || "N/A";
                let subscriptionEnd = card.querySelector(".subscription_end")?.textContent.replace("End: ", "").trim() || "N/A";
                let billingAmount = card.querySelector(".billing_amount")?.textContent.trim() || "N/A";
                let lastPayment = card.querySelector(".last_payment")?.textContent.replace("Last Payment: ", "").trim() || "N/A";

                let customerStatus = "Active"; // Default Status
                if (card.classList.contains("expired")) {
                    customerStatus = "Expired";
                } else if (card.classList.contains("expires-soon")) {
                    customerStatus = "Expires Soon";
                }

                let rowData = [customerName, mobileNumber, customerStatus, planSelected, subscriptionStart, subscriptionEnd, billingAmount, lastPayment];
                allData.push(rowData);

                if (customerStatus === "Expired") {
                    expiredData.push(rowData);
                } else if (customerStatus === "Expires Soon") {
                    expiresSoonData.push(rowData);
                } else {
                    activeData.push(rowData);
                }
            });

            if (allData.length === 1) {
                alert("No customer data available for download!");
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

            createSheet(allData, "All Customers");
            createSheet(expiredData, "Expired Customers");
            createSheet(expiresSoonData, "Expires-Soon Customers");
            createSheet(activeData, "Active Customers");

            XLSX.writeFile(workbook, "Customer_Details.xlsx");
        });
    } else {
        console.error("Download button not found!");
    }
});













// Bulk-Update-Delete-Js

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
    const updateCustomerBtn = document.getElementById("update-customer");
    const cancelUpdateBtn = document.getElementById("cancel-update");

    const statusSelect = document.getElementById("status-dot");
    const customerMobileInput = document.getElementById("update-customer-mobile");
    const customerNameInput = document.getElementById("update-customer-name");

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

        const firstCard = selectedUpdateCards[0];
        const firstStatus = firstCard.querySelector(".status-dot").classList;
        const firstMobile = firstCard.querySelector(".customer_mobile").textContent;
        const firstName = firstCard.querySelector(".customer_name").textContent;

        let allSameStatus = selectedUpdateCards.every(card => card.querySelector(".status-dot").classList.value === firstStatus.value);
        let allSameMobile = selectedUpdateCards.every(card => card.querySelector(".customer_mobile").textContent === firstMobile);
        let allSameName = selectedUpdateCards.every(card => card.querySelector(".customer_name").textContent === firstName);

        statusSelect.value = allSameStatus ? (firstStatus.contains("expired") ? "red" : firstStatus.contains("expires-soon") ? "yellow" : "green") : "";
        customerMobileInput.value = allSameMobile ? firstMobile : "";
        customerNameInput.value = allSameName ? firstName : "";

        updatePopup.style.display = "flex";
    });

    updateCustomerBtn.addEventListener("click", function () {
        selectedUpdateCards.forEach(card => {
            const statusDot = card.querySelector(".status-dot");
            const customerMobile = card.querySelector(".customer_mobile");
            const customerName = card.querySelector(".customer_name");

            card.classList.remove("expired", "expires-soon", "active");
            if (statusSelect.value === "red") {
                card.classList.add("expired");
                statusDot.style.backgroundColor = "red";
            } else if (statusSelect.value === "yellow") {
                card.classList.add("expires-soon");
                statusDot.style.backgroundColor = "yellow";
            } else if (statusSelect.value === "green") {
                card.classList.add("active");
                statusDot.style.backgroundColor = "green";
            }

            if (customerMobileInput.value) customerMobile.textContent = customerMobileInput.value;
            if (customerNameInput.value) customerName.textContent = customerNameInput.value;
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




// Customer-Filtering-Navigation [Expires-soon , Expired, Active]

// Customer-Filtering-Navigation [Expires-soon, Expired, Active]

document.addEventListener("DOMContentLoaded", function () {
    // Get navigation items
    const allNav = document.querySelector(".all_list a");
    const expiresSoonNav = document.querySelector(".expires_soon_list a");
    const expiredNav = document.querySelector(".expired_list a");
    const activeNav = document.querySelector(".active_list a");
    const navLinks = document.querySelectorAll(".expires_list a");

    // Get all customer cards container
    const cardsContainer = document.querySelector(".cust_manage_cards_container");

    // Function to categorize customers based on status
    function categorizeCustomers(categoryClass, event) {
        const customerCards = document.querySelectorAll(".cust_manage_card"); // Get all cards dynamically

        customerCards.forEach((card) => {
            if (categoryClass === "all-category") {
                card.style.display = "flex"; // Show all cards
            } else if (card.classList.contains(categoryClass)) {
                card.style.display = "flex"; // Show matching category cards
            } else {
                card.style.display = "none"; // Hide others
            }
        });

        // Remove active class from all nav links
        navLinks.forEach((link) => link.classList.remove("active-nav"));

        // Ensure the clicked <a> element gets the active class
        const target = event?.target.closest("a");
        if (target) {
            target.classList.add("active-nav");
        }
    }

    // Event Listeners for Categorizing Customers
    allNav.addEventListener("click", function (e) {
        e.preventDefault();
        categorizeCustomers("all-category", e);
    });

    expiresSoonNav.addEventListener("click", function (e) {
        e.preventDefault();
        categorizeCustomers("expires-soon", e);
    });

    expiredNav.addEventListener("click", function (e) {
        e.preventDefault();
        categorizeCustomers("expired", e);
    });

    activeNav.addEventListener("click", function (e) {
        e.preventDefault();
        categorizeCustomers("active", e);
    });

    // Add Customer Functionality
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
        newCard.classList.add("cust_manage_card"); // No "all-category"

        let categoryClass = "";
        if (status === "red") {
            categoryClass = "expired";
        } else if (status === "yellow") {
            categoryClass = "expires-soon";
        } else {
            categoryClass = "active";
        }
        newCard.classList.add(categoryClass); // Assign the correct category

        newCard.innerHTML = `
            <input type="checkbox" class="bulk-delete-checkbox">
            <input type="checkbox" class="bulk-update-checkbox">

            <i class="fa-solid fa-xmark delete-icon"></i>

            <div class="dot_div">
                <span class="status-dot" style="background-color: ${status};" data-tooltip="${tooltipText}"></span>
            </div>

            <div class="customer_info">
                <div class="customer_mobile_div">
                    <span class="customer_mobile">${mobileNumber}</span>
                </div>
                <div class="customer_name_div">
                    <span class="customer_name">${customerName}</span>
                </div>
                <div class="customer_plan_div">
                    <span class="customer_plan">${customerPlan}</span>
                </div>

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

        // Immediately filter to match the current active category
        const activeCategory = document.querySelector(".active-nav");
        if (activeCategory) {
            categorizeCustomers(activeCategory.dataset.category);
        }
    });

    // Attach event listeners on page load
    attachTooltipEvents();
});








//Status-dot

// Status-dot

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
            const name = card.querySelector(".customer_name").textContent.toLowerCase();
            const mobile = card.querySelector(".customer_mobile").textContent.toLowerCase();
            const plan = card.querySelector(".customer_plan")
                ? card.querySelector(".customer_plan").textContent.toLowerCase()
                : "";

            if (name.includes(searchTerm) || mobile.includes(searchTerm) || plan.includes(searchTerm)) {
                card.style.display = "flex"; // Show matching cards
                anyMatch = true;
            } else {
                card.style.display = "none"; // Hide others
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



