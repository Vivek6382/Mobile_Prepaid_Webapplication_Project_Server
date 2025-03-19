
// Profile-DropDown-JS

document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.querySelector(".user-dropdown");
    const userIcon = document.getElementById("userIcon");
    const dropdownContent = document.querySelector(".dropdown-content");
    const signOutBtn = document.getElementById("signOutBtn");

    function updateDropdown() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");
        const accessToken = sessionStorage.getItem("accessToken");

        if (currentCustomer && accessToken) {
            // Show dropdown when user icon is clicked, toggle 'active' class
            userIcon.onclick = function (event) {
                event.stopPropagation();
                userDropdown.classList.toggle("active");
            };

            // Ensure dropdown starts hidden
            userDropdown.classList.remove("active");

            // Sign-out functionality
            signOutBtn.onclick = function (event) {
                event.preventDefault();

                console.log("Before clearing:", {
                    accessToken: sessionStorage.getItem("accessToken"),
                    currentCustomer: sessionStorage.getItem("currentCustomer")
                });

                sessionStorage.removeItem("accessToken"); // Remove specific item
                sessionStorage.removeItem("currentCustomer"); // Remove user data
                localStorage.removeItem("accessToken"); // Ensure it's removed from localStorage

                console.log("After clearing:", {
                    accessToken: sessionStorage.getItem("accessToken"),
                    currentCustomer: sessionStorage.getItem("currentCustomer")
                });

                // Ensure the storage is cleared before redirecting
                setTimeout(() => {
                    window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
                }, 100);
            };
        } else {
            // If not logged in or missing accessToken, redirect to recharge page
            userIcon.onclick = function () {
                window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
            };

            // Ensure dropdown is hidden
            userDropdown.classList.remove("active");
        }
    }

    // Initialize dropdown behavior
    updateDropdown();

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!userDropdown.contains(event.target)) {
            userDropdown.classList.remove("active");
        }
    });

    // Handle case where user manually navigates away after signing out
    window.addEventListener("storage", function () {
        if (!sessionStorage.getItem("currentCustomer") || !sessionStorage.getItem("accessToken")) {
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("currentCustomer");
            localStorage.removeItem("accessToken");
            window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
        }
    });

    // Listen for login event from the recharge form
    window.addEventListener("storage", function () {
        if (sessionStorage.getItem("currentCustomer") && sessionStorage.getItem("accessToken")) {
            updateDropdown(); 
        }
    });
});
      
    







// Inside-Search-Js

// Dynamic Search Functionality for Prepaid Plans

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".tool_search input"); // Search input field
    const cardContainer = document.querySelector(".plan_card-container"); // Parent container for dynamically added cards

    // Function to filter dynamically generated cards
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        const viCards = document.querySelectorAll(".vi_card"); // Fetch all currently available cards

        viCards.forEach((card) => {
            const planName = card.querySelector(".plan-name")?.textContent.toLowerCase() || "";
            const price = card.querySelector(".price")?.textContent.toLowerCase() || "";
            const ottText = card.querySelector(".ott-text-data")?.textContent.toLowerCase() || "";
            const benefits = Array.from(card.querySelectorAll(".benefit"))
                .map(b => b.textContent.toLowerCase())
                .join(" "); // Combine all benefits

            // Check if search term matches any relevant text
            if (planName.includes(searchTerm) || price.includes(searchTerm) || benefits.includes(searchTerm) || ottText.includes(searchTerm)) {
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
            event.preventDefault(); // Prevent unintended form submission
            performSearch();
        }
    });

    // Observe dynamically added cards and reapply search when new plans are loaded
    const observer = new MutationObserver(() => {
        performSearch();
    });

    if (cardContainer) {
        observer.observe(cardContainer, { childList: true, subtree: true });
    }

    // Reapply search when new cards are added
    document.addEventListener("cardsUpdated", performSearch);
});






//Filter-Dynamic-Change-Design-JS

//Filter-Dynamic-Change-Design-JS
document.addEventListener("DOMContentLoaded", function () {
    const filterCategories = document.querySelectorAll(".filter-category");
    const filterOptionsDiv = document.getElementById("filterOptions");
    const filterHeader = document.getElementById("filterHeader");
    const filterModal = document.getElementById("filterModal");
    const openFilterBtn = document.querySelector(".filter_button button");
    const resetFiltersBtn = document.getElementById("resetFilters");
    const confirmFiltersBtn = document.getElementById("confirmFilters");
    const closeFilterBtn = document.getElementById("closeFilter");

    let filters = {
        ott: new Set(),
        totalData: new Set(),
        validity: new Set(),
        dataSpeed: new Set(),
        price: new Set()
    };

    let selectedFilters = {
        ott: new Set(),
        totalData: new Set(),
        validity: new Set(),
        dataSpeed: new Set(),
        price: new Set()
    };

    // Hide modal initially
    filterModal.style.display = "none";

    // Open filter modal
    openFilterBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        filterModal.style.display = "flex";
    });

    // Close filter modal when clicking outside or clicking X button
    document.addEventListener("click", function (event) {
        if (!filterModal.contains(event.target) && !openFilterBtn.contains(event.target)) {
            filterModal.style.display = "none";
        }
    });

    filterModal.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    closeFilterBtn.addEventListener("click", function () {
        filterModal.style.display = "none";
    });

    // Extract unique filter values from dynamically generated cards
    function extractFilters() {
        filters = {
            ott: new Set(),
            totalData: new Set(),
            validity: new Set(),
            dataSpeed: new Set(),
            price: new Set()
        };

        document.querySelectorAll(".vi_card").forEach(card => {
            const extractText = (selector) => {
                const element = card.querySelector(selector);
                return element ? element.parentElement.innerText.trim() : null;
            };

            const totalData = extractText(".benefit i.fa-wifi");
            if (totalData) filters.totalData.add(totalData);

            const validity = extractText(".benefit i.fa-calendar-alt");
            if (validity) filters.validity.add(validity);

            const dataSpeed = extractText(".benefit i.fa-tachometer-alt");
            if (dataSpeed) filters.dataSpeed.add(dataSpeed);

            const priceMatch = card.querySelector(".price")?.innerText.match(/₹(\d+)/);
            if (priceMatch) filters.price.add(`₹${priceMatch[1]}`);

            const ottElement = card.querySelector(".ott-text-data");
            if (ottElement) {
                ottElement.innerText.split(", ").forEach(ott => filters.ott.add(ott.trim()));
            }
        });

        updateFilterUI();
    }

    // Update filter UI dynamically
    function updateFilterUI() {
        const activeCategory = document.querySelector(".filter-category.active")?.getAttribute("data-filter");
        filterOptionsDiv.innerHTML = generateFilterOptions(activeCategory);
        addCheckboxEventListeners();

        // Hide empty categories
        filterCategories.forEach(category => {
            const key = category.getAttribute("data-filter");
            category.style.display = filters[key]?.size ? "block" : "none";
        });
    }

    // Generate checkboxes dynamically, keeping previous selections
    function generateFilterOptions(filterKey) {
        if (!filters[filterKey] || filters[filterKey].size === 0) return "<p>No options available</p>";

        return Array.from(filters[filterKey])
            .map(value => `
                <label>
                    <input type="checkbox" class="filter-checkbox" value="${value}" ${selectedFilters[filterKey].has(value) ? "checked" : ""}>
                    <span class="checkmark"></span> ${value}
                </label>`)
            .join("");
    }

    // Handle category selection
    filterCategories.forEach(category => {
        category.addEventListener("click", function () {
            filterHeader.textContent = this.textContent;
            filterOptionsDiv.innerHTML = generateFilterOptions(this.getAttribute("data-filter"));
            filterOptionsDiv.style.display = "block";

            filterCategories.forEach(cat => cat.classList.remove("active"));
            this.classList.add("active");

            addCheckboxEventListeners();
        });
    });

    // Filtering function with cross-filtering support
    function filterCards() {
        document.querySelectorAll(".vi_card").forEach(card => {
            let matchesAll = true;

            Object.keys(selectedFilters).forEach(category => {
                if (selectedFilters[category].size > 0) {
                    let cardFilters = new Set();

                    const extractText = (selector) => {
                        const element = card.querySelector(selector);
                        return element ? element.parentElement.innerText.trim() : null;
                    };

                    if (category === "totalData") cardFilters.add(extractText(".benefit i.fa-wifi"));
                    if (category === "validity") cardFilters.add(extractText(".benefit i.fa-calendar-alt"));
                    if (category === "dataSpeed") cardFilters.add(extractText(".benefit i.fa-tachometer-alt"));

                    if (category === "price") {
                        const priceMatch = card.querySelector(".price")?.innerText.match(/₹(\d+)/);
                        if (priceMatch) cardFilters.add(`₹${priceMatch[1]}`);
                    }

                    if (category === "ott") {
                        const ottElement = card.querySelector(".ott-text-data");
                        if (ottElement) {
                            ottElement.innerText.split(", ").forEach(ott => cardFilters.add(ott.trim()));
                        }
                    }

                    if (![...selectedFilters[category]].some(filter => cardFilters.has(filter))) {
                        matchesAll = false;
                    }
                }
            });

            card.style.display = matchesAll ? "block" : "none";
        });
    }

    // Add event listeners for checkboxes
    function addCheckboxEventListeners() {
        document.querySelectorAll(".filter-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", function () {
                const category = document.querySelector(".filter-category.active")?.getAttribute("data-filter");
                if (!category) return;

                if (this.checked) {
                    selectedFilters[category].add(this.value);
                } else {
                    selectedFilters[category].delete(this.value);
                }

                filterCards();
            });
        });
    }

    // Reset filters
    resetFiltersBtn.addEventListener("click", function () {
        Object.keys(selectedFilters).forEach(category => selectedFilters[category].clear());
        document.querySelectorAll(".filter-checkbox:checked").forEach(cb => cb.checked = false);
        filterCards();
    });

    // Apply filters and close modal
    confirmFiltersBtn.addEventListener("click", function () {
        filterModal.style.display = "none";
    });

    // Update filters when new cards are added
    document.addEventListener("cardsUpdated", extractFilters);

    // Initial filter extraction
    extractFilters();
});











// Dynamic-OTT-JS for Multiple Cards

document.addEventListener("DOMContentLoaded", function() {
    function updateOTTIcons() {
        document.querySelectorAll(".vi_card").forEach(card => {
            const ottTextElement = card.querySelector(".ott-text-data");
            const ottIconsContainer = card.querySelector(".ott-icons");
            const moreOtt = card.querySelector(".more-ott");

            if (ottTextElement && ottIconsContainer && moreOtt) {
                const ottServices = ottTextElement.innerText.split(", ").map(ott => ott.trim());
                
                const ottLogos = {
                    "Netflix": "./assets/Netflix_Logo.svg",
                    "Amazon Prime": "./assets/Prime_Logo.svg",
                    "Sony LIV": "./assets/Sony_Logo.svg",
                    "Sun NXT": "./assets/Sun_nxt_Logo.svg",
                    "Zee5": "./assets/Zee5_Logo.svg"
                };

                ottIconsContainer.innerHTML = "";
                moreOtt.innerText = "";

                let loadedIcons = 0;

                ottServices.forEach(ott => {
                    if (ottLogos[ott] && loadedIcons < 3) {
                        let icon = document.createElement("div");
                        icon.classList.add("icon");

                        let img = document.createElement("img");
                        img.src = ottLogos[ott];
                        img.alt = ott;

                        // Handle image load errors
                        img.onerror = function() {
                            icon.innerText = ott.charAt(0);  // Show first letter if image fails
                            img.remove(); // Remove broken image
                        };

                        icon.appendChild(img);
                        ottIconsContainer.appendChild(icon);
                        loadedIcons++;
                    }
                });

                // Show "+ more" if there are extra OTT services
                if (ottServices.length > 3) {
                    moreOtt.innerText = `+${ottServices.length - 3} more OTT`;
                }
            }
        });
    }

    // Run initially
    updateOTTIcons();

    // Run after dynamically generated cards are added
    document.addEventListener("cardsUpdated", updateOTTIcons);
});





// Dynamic-Pop-up-Content-JS 
// Dynamic OTT Icons with Fallback Handling (Now Fully Dynamic)
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".vi_card").forEach(card => {
        const ottTextElement = card.querySelector(".ott-text-data");
        const ottIconsContainer = card.querySelector(".ott-icons");
        const moreOtt = card.querySelector(".more-ott");

        if (ottTextElement) {
            const ottServices = ottTextElement.innerText.split(", ").map(ott => ott.trim());
            const ottClassMap = {
                "Netflix": "netflix",
                "Amazon Prime": "prime",
                "Sony LIV": "sony",
                "Sun NXT": "sun",
                "Zee5": "zee5"
            };

            const ottLogos = {
                "Netflix": "./assets/Netflix_Logo.svg",
                "Amazon Prime": "./assets/Prime_Logo.svg",
                "Sony LIV": "./assets/Sony_Logo.svg",
                "Sun NXT": "./assets/Sun_nxt_Logo.svg",
                "Zee5": "./assets/Zee5_Logo.svg"
            };

            ottIconsContainer.innerHTML = "";
            moreOtt.innerText = "";

            let loadedIcons = 0;

            ottServices.forEach(ott => {
                if (loadedIcons < 3) {
                    let icon = document.createElement("div");
                    icon.classList.add("icon");

                    // Apply background color class
                    if (ottClassMap[ott]) {
                        icon.classList.add(ottClassMap[ott]);
                    }

                    let img = document.createElement("img");
                    img.src = ottLogos[ott] || "";
                    img.alt = ott;

                    let fallbackText = document.createElement("span");
                    fallbackText.classList.add("fallback-icon");
                    fallbackText.innerText = ott.charAt(0).toUpperCase(); // First letter as fallback

                    img.onerror = function () {
                        img.remove(); // Remove broken image
                        icon.appendChild(fallbackText);
                    };

                    if (ottLogos[ott]) {
                        icon.appendChild(img);
                    } else {
                        icon.appendChild(fallbackText);
                    }

                    ottIconsContainer.appendChild(icon);
                    loadedIcons++;
                }
            });

            // Show "+ more" if there are extra OTT services
            if (ottServices.length > 3) {
                moreOtt.innerText = `+${ottServices.length - 3} more OTT`;
            }
        }
    });
});







// Dynamic Pop-up Content JS

// Dynamic Pop-up Content JS
document.addEventListener("DOMContentLoaded", () => {

    // Attach event listener to the container to handle dynamically added elements
    document.querySelector(".plan_card-container").addEventListener("click", function (e) {
        if (
            e.target.classList.contains("open-popup") ||
            e.target.closest(".open-popup") ||
            e.target.classList.contains("buy-button") // ✅ Buy Now button triggers popup
        ) {
            e.preventDefault();
            openPopup(e.target.closest(".vi_card"));
        }
    });

    // Close popup event
    document.getElementById("close-unique-popup").addEventListener("click", function () {
        document.getElementById("unique-popup-overlay").classList.remove("active");
    });

    // Mobile Validation JS with Backend Authentication
    const rechargePhoneError = document.getElementById("rechargePhoneError");
    const rechargePhone = document.getElementById("rechargePhone");
    const rechargeButton = document.querySelector(".purchase-button-custom");

    // API Endpoints
    const LOGIN_URL = "http://localhost:8083/auth/login";
    const PROFILE_URL = "http://localhost:8083/auth/profile";

    // Check if currentCustomer exists in session storage
    const currentCustomer = sessionStorage.getItem("currentCustomer");

    if (currentCustomer) {
        // Hide input field if currentCustomer exists
        rechargePhone.style.display = "none";
        rechargePhoneError.style.display = "none";

        // Directly redirect to the payment page on recharge button click
        rechargeButton.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/payment.html";
        });

    } else {
        // Event Listener for Recharge Button Click
        rechargeButton.addEventListener("click", async function (event) {
            event.preventDefault();
            const phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, "");

            // Frontend Validation
            if (!validateRechargeForm(phoneNumberValue)) return;

            try {
                // Backend Validation: Check if the number exists
                let loginResponse = await fetch(LOGIN_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mobile: phoneNumberValue })
                });

                if (!loginResponse.ok) {
                    throw new Error("🚫 Invalid phone number. Please enter a valid registered number.");
                }

                let loginData = await loginResponse.json();
                sessionStorage.setItem("accessToken", loginData.accessToken);

                // Fetch User Profile
                let profileResponse = await fetch(PROFILE_URL, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${loginData.accessToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!profileResponse.ok) {
                    throw new Error("🚫 Failed to fetch user profile. Please try again.");
                }

                let userProfile = await profileResponse.json();
                sessionStorage.setItem("currentCustomer", JSON.stringify(userProfile));

                // ✅ Redirect to Payment Page on Success
                window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/payment.html";

            } catch (error) {
                rechargePhoneError.innerHTML = error.message;
            }
        });

        // Dynamic Error Display on Input Change
        rechargePhone.addEventListener("input", function () {
            const phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, "");
            validateRechargeForm(phoneNumberValue);
        });
    }

    // Validation Function
    function validateRechargeForm(phoneNumberValue) {
        rechargePhoneError.innerHTML = ""; // Clear previous errors

        if (phoneNumberValue === "") {
            rechargePhoneError.innerHTML = "📢 Phone Number is required.";
            return false;
        }
        if (!/^\d*$/.test(phoneNumberValue)) {
            rechargePhoneError.innerHTML = "⚠️ Enter only digits (0-9).";
            return false;
        }
        if (phoneNumberValue.length < 10) {
            rechargePhoneError.innerHTML = "⚠️ Enter a valid 10-digit phone number.";
            return false;
        }
        if (phoneNumberValue.length > 10) {
            rechargePhoneError.innerHTML = "❌ Phone number should be exactly 10 digits.";
            return false;
        }
        return true;
    }

});




// Function to open the popup dynamically
function openPopup(card) {
    if (!card) return;

    // Set Plan Name & Cost
    document.querySelector(".plan-title-custom").textContent = card.querySelector(".plan-name").textContent;
    document.querySelector(".plan-cost-custom").textContent = card.querySelector(".price").textContent;

    // Map icons to their respective features
    const featureMap = {
        "fas fa-clock": "Expires on",
        "fas fa-calendar-alt": "Pack validity",
        "fas fa-tachometer-alt": "Data at high speed*",
        "fas fa-phone-alt": "Voice",
        "fas fa-wifi": "Total data",
        "fas fa-envelope": "SMS"
    };

    // Populate Plan Details Table
    const planDetailsBody = document.getElementById("plan-details-body");
    planDetailsBody.innerHTML = "";

    card.querySelectorAll(".benefit").forEach(benefit => {
        const iconClass = benefit.querySelector("i")?.className.trim();
        const textValue = benefit.textContent.trim();

        if (iconClass && textValue) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="feature-name">${featureMap[iconClass] || "Unknown"}</td>
                <td class="feature-separator"></td>
                <td class="feature-value">${textValue}</td>
            `;
            planDetailsBody.appendChild(row);
        }
    });

    // Populate OTT Benefits
    const perkList = document.querySelector(".perk-list-custom");
    const extraPerksSection = document.querySelector(".extra-perks-custom");
    perkList.innerHTML = "";

    const ottTextElement = card.querySelector(".ott-text-data");
    if (ottTextElement) {
        const ottNames = ottTextElement.textContent.split(", ").map(ott => ott.trim());
        const ottDescriptions = card.querySelectorAll(".ott-description-data div");

        const logoMap = {
            "Netflix": "./assets/Netflix_Logo.svg",
            "Amazon Prime": "./assets/Prime_Logo.svg",
            "Sony LIV": "./assets/Sony_Logo.svg",
            "Sun NXT": "./assets/Sun_nxt_Logo.svg",
            "Zee5": "./assets/Zee5_Logo.svg"
        };

        const classMap = {
            "Netflix": "netflix",
            "Amazon Prime": "prime",
            "Sony LIV": "sony",
            "Sun NXT": "sun",
            "Zee5": "zee5"
        };

        function createFallbackIcon(name) {
            const fallbackDiv = document.createElement("div");
            fallbackDiv.classList.add("fallback-icon", classMap[name] || "default-fallback");
            fallbackDiv.innerText = name.charAt(0).toUpperCase();
            return fallbackDiv;
        }

        ottNames.forEach(name => {
            const desc = [...ottDescriptions].find(div => div.getAttribute("data-ott") === name)?.textContent || "";
            const imgSrc = logoMap[name] || "";

            const perkItem = document.createElement("div");
            perkItem.classList.add("perk-item-custom");

            let imgElement = document.createElement("img");
            imgElement.src = imgSrc;
            imgElement.alt = `${name} Logo`;

            imgElement.onerror = function () {
                imgElement.remove();
                perkItem.insertBefore(createFallbackIcon(name), perkItem.firstChild);
            };

            if (imgSrc) {
                perkItem.appendChild(imgElement);
            } else {
                perkItem.appendChild(createFallbackIcon(name));
            }

            const perkInfo = document.createElement("div");
            perkInfo.classList.add("perk-info-custom");
            perkInfo.innerHTML = `<span class="perk-title-custom">${name}</span><p>${desc}</p>`;

            perkItem.appendChild(perkInfo);
            perkList.appendChild(perkItem);
        });

        extraPerksSection.style.display = ottNames.length > 0 ? "block" : "none";
    } else {
        extraPerksSection.style.display = "none";
    }

    document.getElementById("unique-popup-overlay").classList.add("active");
}











// Popular-Plans-Dynamically-Generate-cards

// Popular-Plans-Dynamically-Generate-cards
document.addEventListener("DOMContentLoaded", function () {
    const planCategories = document.querySelectorAll(".sidebar nav a");
    const container = document.querySelector(".plan_card-container");

    // Function to Load JSON Data from Backend API
    function loadPlans(categoryName) {
        fetch("http://localhost:8083/api/prepaid-plans")
            .then(response => response.json())
            .then(plans => {
                // Filter plans based on selected category
                const filteredPlans = plans.filter(plan => 
                    plan.categories.some(category => category.categoryName === categoryName)
                );
                generatePlans(filteredPlans); // Generate cards dynamically
            })
            .catch(error => console.error(`Error fetching plans:`, error));
    }

    // Function to Generate Plan Cards
    function generatePlans(plans) {
        container.innerHTML = ""; // Clear previous content

        plans.forEach(plan => {
            const card = document.createElement("div");
            card.classList.add("vi_card");

            let benefitsHTML = "";

            if (plan.validity) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-calendar-alt"></i> ${plan.validity} Days</div>`;
            }
            if (plan.dailyData) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-tachometer-alt"></i> ${plan.dailyData}</div>`;
            }
            if (plan.voice) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-phone-alt"></i> ${plan.voice}</div>`;
            }
            if (plan.totalData) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-wifi"></i> ${plan.totalData}</div>`;
            }
            if (plan.sms) {
                benefitsHTML += `<div class="benefit"><i class="fas fa-envelope"></i> ${plan.sms}</div>`;
            }

            let ottHTML = "";
            if (plan.ott && plan.ott.length > 0) {
                ottHTML = `
                    <div class="ott-text-data" style="display: none;">
                        ${plan.ott.join(", ")}
                    </div>
                    <div class="ott-description-data" style="display: none;">
                        ${plan.ott.map(ott => `
                            <div data-ott="${ott}">Enjoy ${ott}'s premium content.</div>
                        `).join("")}
                    </div>
                    <div class="ott-icons"></div>
                    <div class="more-ott"></div>
                `;
            }

            let termsHTML = "";
            if (plan.terms && plan.terms.length > 0) {
                termsHTML = `
                    <div class="terms-conditions" style="display: none;">
                        ${plan.terms.map(term => `<p>${term}</p>`).join("")}
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="card-header">
                    <div class="card-title-price">
                        <div class="plan-name">${plan.planName}</div>
                        <div class="price">₹${plan.price}/month</div>
                    </div>
                    <div class="card-view-details">
                        <i class="fa-solid fa-arrow-right open-popup"></i>
                    </div>
                </div>
                <div class="card-content">
                    ${benefitsHTML}
                    ${ottHTML}
                    ${termsHTML}
                </div>
                <div class="card-footer">
                    <a href="/Mobile_Prepaid_Customer/Payment_Page/payment.html" class="buy-link">
                        <button class="buy-button">Buy Now</button>
                    </a>
                </div>
            `;

            container.appendChild(card);

            const buyButton = card.querySelector(".buy-button");
            buyButton.addEventListener("click", function () {
                sessionStorage.setItem("currentPlan", JSON.stringify(plan));
            });

            const arrowButton = card.querySelector(".open-popup");
            arrowButton.addEventListener("click", function () {
                sessionStorage.setItem("currentPlan", JSON.stringify(plan));
            });
        });

        document.dispatchEvent(new Event("cardsUpdated"));
    }

    planCategories.forEach(category => {
        category.addEventListener("click", function (event) {
            event.preventDefault();

            planCategories.forEach(cat => cat.classList.remove("active"));
            this.classList.add("active");

            const selectedCategory = this.innerText.trim();
            loadPlans(selectedCategory);
        });
    });

    loadPlans("Popular Plans");


    async function fetchCategories() {
        try {
            const response = await fetch("http://localhost:8083/api/categories");
            const categories = await response.json();
            const categoryNav = document.getElementById("categoryNav");
            categoryNav.innerHTML = ""; // Clear existing categories
    
            categories.forEach(category => {
                const categoryName = category.categoryName;
    
                const categoryLink = document.createElement("a");
                categoryLink.textContent = categoryName;
                categoryLink.classList.add("category-item");
    
                // Add click event listener
                categoryLink.addEventListener("click", function (event) {
                    event.preventDefault();
    
                    // Remove 'active' class from all categories
                    document.querySelectorAll("#categoryNav a").forEach(cat => cat.classList.remove("active"));
                    this.classList.add("active");
    
                    // Load the selected category's plans
                    loadPlans(categoryName);
                });
    
                categoryNav.appendChild(categoryLink);
    
                // Set "Popular Plans" as active and load it by default
                if (categoryName.toLowerCase() === "popular plans") {
                    categoryLink.classList.add("active");
                    loadPlans(categoryName);
                }
            });
    
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }
    

fetchCategories(); // Load categories on page load

});







// Recharge-Pop-up-JS with Backend Authentication

document.addEventListener("DOMContentLoaded", function () {
    const changeBtn = document.querySelector(".change-button");
    const overlay = document.getElementById("overlay");
    const popup = document.querySelector(".popup");
    const closePopup = document.getElementById("closePopup");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const phoneNumberSpan = document.getElementById("phoneNumber");
    const newMobileNumber = document.getElementById("newMobileNumber");
    const newMobileError = document.getElementById("newMobileError");

    // API Endpoint for login and profile fetch
    const LOGIN_URL = "http://localhost:8083/auth/login";
    const PROFILE_URL = "http://localhost:8083/auth/profile";

    // Show pop-up
    changeBtn.addEventListener("click", () => {
        overlay.classList.add("active");
        popup.classList.add("active");
        newMobileNumber.value = phoneNumberSpan.textContent.trim(); // Pre-fill input field with current number
        validateNewMobileNumber(newMobileNumber.value); // Validate on open
    });

    // Hide pop-up
    closePopup.addEventListener("click", closePopupFunction);
    cancelBtn.addEventListener("click", closePopupFunction);

    // Update mobile number and fetch customer details
    confirmBtn.addEventListener("click", async () => {
        let newNumber = newMobileNumber.value.trim().replace(/\s+/g, ""); // Remove spaces

        if (!validateNewMobileNumber(newNumber)) return;

        try {
            // Login API Request to generate a new access token for the new user
            let loginResponse = await fetch(LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobile: newNumber })
            });

            if (!loginResponse.ok) throw new Error("Failed to login. Invalid mobile number.");

            let loginData = await loginResponse.json();
            sessionStorage.setItem("accessToken", loginData.accessToken);

            // Fetch user profile based on new mobile number
            let profileResponse = await fetch(PROFILE_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${loginData.accessToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!profileResponse.ok) throw new Error("Failed to fetch user profile.");

            let userProfile = await profileResponse.json();

            // Check if the entered mobile number matches the user profile
            if (userProfile.mobile === newNumber) {
                // Update displayed number
                phoneNumberSpan.textContent = newNumber;

                // Update current customer in session storage
                sessionStorage.setItem("currentCustomer", JSON.stringify(userProfile));

                // Close the pop-up
                closePopupFunction();
            } else {
                newMobileError.textContent = "🚫 This number is not associated with your account.";
            }
        } catch (error) {
            newMobileError.textContent = `🚫 ${error.message}`;
        }
    });

    // Real-time validation on input change
    newMobileNumber.addEventListener("input", function () {
        let newNumber = newMobileNumber.value.trim().replace(/\s+/g, "");
        validateNewMobileNumber(newNumber);
    });

    // Close popup when clicking outside
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closePopupFunction();
        }
    });

    // Function to close pop-up
    function closePopupFunction() {
        overlay.classList.remove("active");
        popup.classList.remove("active");
        newMobileError.textContent = ""; // Clear error message
    }

    // Validation Function
    function validateNewMobileNumber(number) {
        let isValid = true;
        newMobileError.textContent = ""; // Clear previous errors

        if (number === "") {
            newMobileError.textContent = "📢 Phone Number is required.";
            isValid = false;
        } else if (!/^\d*$/.test(number)) {
            newMobileError.textContent = "⚠️ Enter only digits (0-9).";
            isValid = false;
        } else if (number.length < 10) {
            newMobileError.textContent = "⚠️ Enter a valid 10-digit phone number.";
            isValid = false;
        } else if (number.length > 10) {
            newMobileError.textContent = "❌ Phone number should be 10 digits long.";
            isValid = false;
        }

        return isValid;
    }
});






//Recharge-card-display-fetch-js

document.addEventListener("DOMContentLoaded", function () {
    const phoneNumberSpan = document.getElementById("phoneNumber");
    const rechargeCard = document.getElementById("rechargeCard");

    // Retrieve customer data from sessionStorage
    let currentCustomer = sessionStorage.getItem("currentCustomer");

    if (currentCustomer) {
        currentCustomer = JSON.parse(currentCustomer);
        phoneNumberSpan.textContent = currentCustomer.mobile; // Update number dynamically
        rechargeCard.style.display = "flex"; // Show card
    } else {
        rechargeCard.style.display = "none"; // Hide card if no data
    }
});









