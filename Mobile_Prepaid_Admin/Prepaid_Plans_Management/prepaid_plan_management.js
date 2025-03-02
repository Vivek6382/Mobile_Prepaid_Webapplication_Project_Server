// Delete-Js

document.addEventListener("DOMContentLoaded", function () {
    const deletePopup = document.getElementById("delete-popup");
    const confirmDeleteBtn = document.getElementById("confirm-delete");
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const prepaidPlansContainer = document.querySelector(".plan_card-container"); // Correct container
    let currentCard = null;
  
    // Ensure pop-up is hidden on page load
    deletePopup.style.display = "none";
  
    // Function to show the pop-up
    function openDeletePopup(cardElement) {
      currentCard = cardElement;
      deletePopup.style.display = "flex";
  
      // Get the plan details dynamically
      const planName = cardElement.querySelector(".plan-name").textContent;
      const price = cardElement.querySelector(".price").textContent;
      const validity = cardElement
        .querySelector(".fa-calendar-alt")
        .parentElement.textContent.trim();
  
      // Update the delete pop-up content
      document.querySelector(
        "#delete-popup .detail:nth-child(1)"
      ).innerHTML = `<strong>Plan Name:</strong> ${planName}`;
      document.querySelector(
        "#delete-popup .detail:nth-child(2)"
      ).innerHTML = `<strong>Price:</strong> ${price}`;
      document.querySelector(
        "#delete-popup .detail:nth-child(3)"
      ).innerHTML = `<strong>Validity:</strong> ${validity}`;
    }
  
    // **Fix: Use Event Delegation**
    prepaidPlansContainer.addEventListener("click", function (event) {
      if (event.target.closest(".delete-icon")) {
        const card = event.target.closest(".vi_card");
        openDeletePopup(card);
      }
    });
  
    // Handle delete confirmation
    confirmDeleteBtn.addEventListener("click", function () {
      if (currentCard) {
        currentCard.remove(); // Remove the selected card
        currentCard = null;
      }
      deletePopup.style.display = "none"; // Close the pop-up
    });
  
    // Handle cancel action
    cancelDeleteBtn.addEventListener("click", function () {
      deletePopup.style.display = "none";
      currentCard = null;
    });
  });
  






// Update Pop-up JavaScript
// Update Pop-up JavaScript
// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  const updatePopup = document.getElementById("update-popup");
  const updatePlanBtn = document.getElementById("update-plan");
  const cancelUpdateBtn = document.getElementById("cancel-update");

  // Inputs
  const planNameInput = document.getElementById("plan-name");
  const planPriceInput = document.getElementById("plan-price");
  const planValidityInput = document.getElementById("plan-validity");
  const planCallsInput = document.getElementById("plan-calls");
  const planDataInput = document.getElementById("plan-data");
  const planSmsInput = document.getElementById("plan-sms");

  let currentCard = null; // Stores the currently selected card

  // Function to extract plan details from a card
  function extractPlanDetails(cardElement) {
    if (!cardElement) return;

    currentCard = cardElement;

    // Extract values from the card and update input fields
    planNameInput.value =
      currentCard.querySelector(".plan-name")?.textContent.trim() || "";
    planPriceInput.value =
      currentCard
        .querySelector(".price")
        ?.textContent.replace("₹", "")
        .trim() || "";

    // Extract values from benefits section
    currentCard.querySelectorAll(".benefit").forEach((benefit) => {
      if (benefit.querySelector(".fa-phone-alt")) {
        planCallsInput.value = benefit.textContent.trim(); // Keep full text (e.g., "Unlimited Calls (Local, STD, Roaming)")
      } else if (benefit.querySelector(".fa-wifi")) {
        planDataInput.value = benefit.textContent.trim(); // Keep full text (e.g., "50GB Data")
      } else if (benefit.querySelector(".fa-envelope")) {
        planSmsInput.value = benefit.textContent.trim(); // Keep full text (e.g., "1500 SMS/Month")
      } else if (benefit.querySelector(".fa-calendar-alt")) {
        planValidityInput.value = benefit.textContent
          .replace("Validity:", "")
          .trim(); // Keep only the value (e.g., "28 Days")
      }
    });

    // Show the update pop-up
    updatePopup.style.display = "flex";
  }

  // Event delegation to handle edit button clicks dynamically
  document.addEventListener("click", function (event) {
    const editIcon = event.target.closest(".edit-icon"); // Find edit icon

    if (editIcon) {
      const card = editIcon.closest(".vi_card"); // Find the associated card
      if (card) {
        extractPlanDetails(card);
      }
    }
  });

  // Handle cancel action (close pop-up without saving)
  cancelUpdateBtn.addEventListener("click", function () {
    updatePopup.style.display = "none";
    currentCard = null;
  });

  // Handle update action (save changes and update card)
  updatePlanBtn.addEventListener("click", function () {
    if (currentCard) {
      currentCard.querySelector(".plan-name").textContent = planNameInput.value;
      currentCard.querySelector(
        ".price"
      ).textContent = `₹${planPriceInput.value}`;

      // Update benefits while keeping icons
      currentCard.querySelectorAll(".benefit").forEach((benefit) => {
        if (benefit.querySelector(".fa-phone-alt")) {
          benefit.innerHTML = `<i class="fas fa-phone-alt"></i> ${planCallsInput.value}`;
        } else if (benefit.querySelector(".fa-wifi")) {
          benefit.innerHTML = `<i class="fas fa-wifi"></i> ${planDataInput.value}`;
        } else if (benefit.querySelector(".fa-envelope")) {
          benefit.innerHTML = `<i class="fas fa-envelope"></i> ${planSmsInput.value}`;
        } else if (benefit.querySelector(".fa-calendar-alt")) {
          benefit.innerHTML = `<i class="fas fa-calendar-alt"></i> Validity: ${planValidityInput.value}`;
        }
      });
    }

    // Close the pop-up after updating
    updatePopup.style.display = "none";
    currentCard = null;
  });
});




// Add-Js

document.addEventListener("DOMContentLoaded", function () {
    // Select Elements
    const prepaidAddPopup = document.getElementById("prepaid-add-popup");
    const prepaidCancelBtn = document.getElementById("prepaid-cancel-btn");
    const prepaidAddBtn = document.getElementById("prepaid-add-btn");
    const prepaidPlansContainer = document.querySelector(".plan_card-container"); // Correct container

    if (!prepaidPlansContainer) {
        console.error("Error: plan_card-container is not found in the DOM.");
        return;
    }

    // Input Fields
    const prepaidPlanNameInput = document.getElementById("prepaid-plan-name");
    const prepaidPlanPriceInput = document.getElementById("prepaid-plan-price");
    const prepaidPlanValidityInput = document.getElementById("prepaid-plan-validity");
    const prepaidPlanCallsInput = document.getElementById("prepaid-plan-calls");
    const prepaidPlanDataInput = document.getElementById("prepaid-plan-data");
    const prepaidPlanSmsInput = document.getElementById("prepaid-plan-sms");

    // Show Pop-up when `.add-action` button is clicked
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-action")) {
            prepaidAddPopup.style.display = "flex";
        }
    });

    // Hide Pop-up when cancel button is clicked
    prepaidCancelBtn.addEventListener("click", () => {
        prepaidAddPopup.style.display = "none";
    });

    // Add Prepaid Plan
    prepaidAddBtn.addEventListener("click", function () {
        const planName = prepaidPlanNameInput.value.trim();
        const planPrice = prepaidPlanPriceInput.value.trim();
        const planValidity = prepaidPlanValidityInput.value.trim();
        const planCalls = prepaidPlanCallsInput.value.trim();
        const planData = prepaidPlanDataInput.value.trim();
        const planSms = prepaidPlanSmsInput.value.trim();

        if (!planName || !planPrice || !planValidity || !planCalls || !planData || !planSms) {
            alert("Please fill in all fields.");
            return;
        }

        // Debugging: Check if values are being captured
        console.log("Adding Plan:", { planName, planPrice, planValidity, planCalls, planData, planSms });

        // Create a new prepaid plan card
        const newCard = document.createElement("div");
        newCard.classList.add("vi_card");

        newCard.innerHTML = `
            <div class="delete-icon">
                <i class="fas fa-times"></i>
            </div>
            <div class="card-header">
                <input type="checkbox" class="bulk-delete-checkbox"> 
                <div class="card-title-price">
                    <div class="plan-name">${planName}</div>
                    <div class="price">₹${planPrice}/month</div>
                </div>
            </div>
            <div class="card-content">
                <div class="benefit"><i class="fas fa-phone-alt"></i> ${planCalls}</div>
                <div class="benefit"><i class="fas fa-wifi"></i> ${planData}</div>
                <div class="benefit"><i class="fas fa-envelope"></i> ${planSms}</div>
                <div class="benefit"><i class="fas fa-calendar-alt"></i> Validity: ${planValidity}</div>
            </div>
            <div class="card-footer">
                <div class="view-icon">
                    <a href="/Mobile_Prepaid_Admin/Prepaid_Plans_Management/Card_Full_View_Management/card_full_view_manage.html">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
                <div class="edit-icon">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <a href="/Mobile_Prepaid_Customer/Payment_Page/payment.html" class="buy-link">
                    <button class="buy-button">Buy Now</button>
                </a>
            </div>
        `;

        // Append to container
        prepaidPlansContainer.appendChild(newCard);

        // Clear input fields
        prepaidPlanNameInput.value = "";
        prepaidPlanPriceInput.value = "";
        prepaidPlanValidityInput.value = "";
        prepaidPlanCallsInput.value = "";
        prepaidPlanDataInput.value = "";
        prepaidPlanSmsInput.value = "";

        // Close pop-up
        prepaidAddPopup.style.display = "none";
    });
});






// Bulk-Update-Delete-JS


document.addEventListener("DOMContentLoaded", function () {
    let activeMode = null; // Tracks if delete or update is active

    /** ---------------- BULK DELETE ---------------- **/
    const deleteButton = document.querySelector(".delete-action");
    const deleteCheckboxes = document.querySelectorAll(".bulk-delete-checkbox");
    const bulkDeletePanel = document.querySelector(".bulk-delete-panel");
    const deleteSelectedButton = document.querySelector(".delete-selected");
    const cancelDeleteButton = document.querySelector(".cancel-action");

    if (deleteButton) {
        deleteButton.addEventListener("click", function () {
            if (activeMode === "update") return; // Prevent action if update is active
            activeMode = "delete"; // Set delete mode active
            showDeleteCheckboxes();
        });
    }

    deleteCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            toggleActionPanel(deleteCheckboxes, bulkDeletePanel);
        });
    });

    deleteSelectedButton.addEventListener("click", function () {
        deleteCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.closest(".vi_card").remove(); // Delete selected cards
            }
        });
        resetBulkActions();
    });

    cancelDeleteButton.addEventListener("click", function () {
        resetBulkActions();
    });

    function showDeleteCheckboxes() {
        deleteCheckboxes.forEach(checkbox => checkbox.style.display = "inline-block");
    }

    /** ---------------- BULK UPDATE ---------------- **/
    const updateButton = document.querySelector(".bulk-update-trigger");
    const updateCheckboxes = document.querySelectorAll(".bulk-update-checkbox");
    const bulkUpdatePanel = document.querySelector(".bulk-update-panel");
    const updateSelectedButton = document.querySelector(".update-selected");
    const cancelUpdateButton = document.querySelector(".cancel-update-action");
    const updatePopup = document.getElementById("update-popup");
    const cancelUpdatePopupButton = document.getElementById("cancel-update");
    const updatePlanButton = document.getElementById("update-plan");

    let selectedUpdateCards = [];

    if (updateButton) {
        updateButton.addEventListener("click", function () {
            if (activeMode === "delete") return; // Prevent action if delete is active
            activeMode = "update"; // Set update mode active
            showUpdateCheckboxes();
        });
    }

    updateCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            selectedUpdateCards = [...updateCheckboxes].filter(cb => cb.checked).map(cb => cb.closest(".vi_card"));
            bulkUpdatePanel.style.bottom = selectedUpdateCards.length > 0 ? "0" : "-60px";
        });
    });

    updateSelectedButton.addEventListener("click", function () {
        if (selectedUpdateCards.length === 0) return;

        // Open update popup
        updatePopup.style.display = "block";

        // Pre-fill popup fields with the first selected card's data
        let firstCard = selectedUpdateCards[0];
        document.getElementById("plan-name").value = firstCard.querySelector(".plan-name").textContent;
        document.getElementById("plan-price").value = firstCard.querySelector(".price").textContent.replace("₹", "").replace("/month", "");
        
        // Populate other fields accordingly (add more if needed)
        
        resetBulkActions();
    });

    cancelUpdatePopupButton.addEventListener("click", function () {
        updatePopup.style.display = "none";
    });

    updatePlanButton.addEventListener("click", function () {
        if (selectedUpdateCards.length === 0) return;

        selectedUpdateCards.forEach(card => {
            card.querySelector(".plan-name").textContent = document.getElementById("plan-name").value;
            card.querySelector(".price").textContent = `₹${document.getElementById("plan-price").value}/month`;
            // Update other fields if needed
        });

        updatePopup.style.display = "none";
        resetBulkActions();
    });

    cancelUpdateButton.addEventListener("click", function () {
        resetBulkActions();
    });

    function showUpdateCheckboxes() {
        updateCheckboxes.forEach(checkbox => checkbox.style.display = "inline-block");
    }

    /** ---------------- HELPER FUNCTION ---------------- **/
    function toggleActionPanel(checkboxes, panel) {
        const anyChecked = [...checkboxes].some(cb => cb.checked);
        panel.style.bottom = anyChecked ? "0" : "-60px";
    }

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







// Inside-Search-Js

// Inside-Search-Js

// Ensure script runs after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".tool_search input"); // Search input field
    const viCards = document.querySelectorAll(".vi_card"); // Fetch all the cards

    // Function to filter vi_card elements based on search input
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        viCards.forEach((card) => {
            const planName = card.querySelector(".plan-name").textContent.toLowerCase(); // Plan Name
            const price = card.querySelector(".price").textContent.toLowerCase(); // Price
            const benefits = Array.from(card.querySelectorAll(".benefit")).map(b => b.textContent.toLowerCase()).join(" "); // All benefits combined
            
            // Check if search term matches any relevant text
            if (planName.includes(searchTerm) || price.includes(searchTerm) || benefits.includes(searchTerm)) {
                card.style.display = "block"; // Show matching cards
            } else {
                card.style.display = "none"; // Hide non-matching cards
            }
        });
    }

    // Trigger search when typing
    searchInput.addEventListener("input", performSearch);

    // Trigger search when pressing Enter
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent any unintended form submission
            performSearch();
        }
    });

    // Monitor for newly added cards (if dynamically added)
    const observer = new MutationObserver(() => {
        performSearch(); // Reapply search when a new card is added
    });

    // Observe the parent container of vi_cards
    const cardContainer = document.querySelector(".customer_list"); // Adjust if necessary
    if (cardContainer) {
        observer.observe(cardContainer, { childList: true });
    }
});





//Filter-Dynamic-Change-Design-JS

// Filter-Dynamic-Change-Design-JS

document.addEventListener("DOMContentLoaded", function () {
    const filterCategories = document.querySelectorAll(".filter-category");
    const filterOptionsDiv = document.getElementById("filterOptions");
    const filterHeader = document.getElementById("filterHeader");
    const filterModal = document.getElementById("filterModal");
    const openFilterBtn = document.querySelector(".filter_button button");
    const resetFiltersBtn = document.getElementById("resetFilters");
    const confirmFiltersBtn = document.getElementById("confirmFilters");
    const cards = document.querySelectorAll(".vi_card");

    // Hide modal initially
    filterModal.style.display = "none";

    // Open filter modal when filter button is clicked
    openFilterBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        filterModal.style.display = "flex";
    });

    // Close filter modal when clicking outside of it
    document.addEventListener("click", function (event) {
        if (!filterModal.contains(event.target) && !openFilterBtn.contains(event.target)) {
            filterModal.style.display = "none";
        }
    });

    filterModal.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Extract unique filter values dynamically from cards
    const filters = { data: new Set(), validity: new Set(), price: new Set() };

    cards.forEach(card => {
        const benefits = card.querySelectorAll(".benefit");

        benefits.forEach(benefit => {
            if (benefit.innerHTML.includes("Data")) {
                let match = benefit.innerText.match(/(\d+GB)/);
                if (match) filters.data.add(match[0]);
            }
            if (benefit.innerHTML.includes("Validity")) {
                let match = benefit.innerText.match(/(\d+)\s*Days/);
                if (match) filters.validity.add(match[0] + " Days");
            }
        });

        const priceMatch = card.querySelector(".price").innerText.match(/₹(\d+)/);
        if (priceMatch) filters.price.add(`₹${priceMatch[1]}`);
    });

    // Function to create filter checkboxes dynamically
    function generateFilterOptions(filterKey) {
        return Array.from(filters[filterKey]).map(value =>
            `<label><input type="checkbox" class="filter-checkbox" value="${value}"> ${value}</label>`
        ).join("");
    }

    // Load initial category (Data)
    filterOptionsDiv.innerHTML = generateFilterOptions("data");

    // Handle category selection
    filterCategories.forEach(category => {
        category.addEventListener("click", function () {
            filterHeader.textContent = this.textContent;
            filterOptionsDiv.innerHTML = generateFilterOptions(this.getAttribute("data-filter"));
            filterOptionsDiv.style.display = "block";

            // Remove active class from all categories, add to selected one
            filterCategories.forEach(cat => cat.classList.remove("active"));
            this.classList.add("active");

            addCheckboxEventListeners();
        });
    });

    // Function to filter cards
    function filterCards() {
        const activeFilters = Array.from(document.querySelectorAll(".filter-checkbox:checked")).map(cb => cb.value);

        cards.forEach(card => {
            const cardFilters = new Set();
            card.querySelectorAll(".benefit").forEach(benefit => {
                let matchData = benefit.innerText.match(/(\d+GB)/);
                if (matchData) cardFilters.add(matchData[0]);

                let matchValidity = benefit.innerText.match(/(\d+)\s*Days/);
                if (matchValidity) cardFilters.add(matchValidity[0] + " Days");
            });

            let matchPrice = card.querySelector(".price").innerText.match(/₹(\d+)/);
            if (matchPrice) cardFilters.add(`₹${matchPrice[1]}`);

            // If no filters are selected, show all cards
            if (activeFilters.length === 0) {
                card.style.display = "block";
                return;
            }

            // Show the card only if it matches at least one selected filter
            const isMatch = activeFilters.some(filter => cardFilters.has(filter));
            card.style.display = isMatch ? "block" : "none";
        });
    }

    // Add event listeners for checkboxes
    function addCheckboxEventListeners() {
        document.querySelectorAll(".filter-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", filterCards);
        });
    }

    // Reset filters
    resetFiltersBtn.addEventListener("click", function () {
        document.querySelectorAll(".filter-checkbox:checked").forEach(cb => cb.checked = false);
        filterCards();
    });

    // Apply filters and close modal
    confirmFiltersBtn.addEventListener("click", function () {
        filterModal.style.display = "none";
    });

    addCheckboxEventListeners();
});



// Full-card-view-Js

document.addEventListener("DOMContentLoaded", function () {
    const fullCardPopup = document.getElementById("full-card-popup");
    const editIcons = document.querySelectorAll(".view-icon"); // Select all edit icons
    const closePopupBtn = document.getElementById("close-full-card-popup");

    // Open Popup when any edit icon is clicked
    editIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            fullCardPopup.style.display = "flex";
        });
    });

    // Close Popup Function
    function closePopup() {
        fullCardPopup.style.display = "none";
    }

    // Close Popup on clicking "X"
    closePopupBtn.addEventListener("click", closePopup);

    // Close when clicking outside the popup
    fullCardPopup.addEventListener("click", function (e) {
        if (e.target === fullCardPopup) {
            closePopup();
        }
    });
});
