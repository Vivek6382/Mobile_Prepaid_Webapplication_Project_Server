document.addEventListener('DOMContentLoaded', function () {
    var splide = new Splide('#image-carousel', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        interval: 3000,
        pauseOnHover: true,
        arrows: true, // Navigation arrows enabled
        pagination: false,
    });

    var bar = document.querySelector('.my-slider-progress-bar');

    splide.on('mounted move', function () {
        var end = splide.Components.Controller.getEnd() + 1;
        var rate = Math.min((splide.index + 1) / end, 1);
        bar.style.width = String(100 * rate) + '%';
    });

    splide.mount();
});



// <!-- Initialize Splide.js -->

  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#why-choose-slider', {
      type: 'slide',
      perPage: 3,
      perMove: 1,
      gap: '20px',
      pagination: false,
      arrows: true,
      breakpoints: {
        1024: { perPage: 2 },
        768: { perPage: 1 }
      }
    }).mount();
  });





  // Profile-DropDown-JS

  document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.querySelector(".user-dropdown");
    const userIcon = document.getElementById("userIcon");
    const dropdownContent = document.querySelector(".dropdown-content");
    const signOutBtn = document.getElementById("signOutBtn");

    function updateDropdown() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");

        if (currentCustomer) {
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
                sessionStorage.removeItem("currentCustomer"); // Remove session storage

                // Ensure the storage is cleared before redirecting
                setTimeout(() => {
                    window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
                }, 100);
            };
        } else {
            // If not logged in, clicking the user icon redirects to the recharge page
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
        if (!sessionStorage.getItem("currentCustomer")) {
            window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
        }
    });

    // Listen for login event from the recharge form
    window.addEventListener("storage", function () {
        if (sessionStorage.getItem("currentCustomer")) {
            updateDropdown(); // Update dropdown dynamically after login
        }
    });

});












// Mobile-Validation-Js

// Phone number regex pattern (10-digit number)
var phonePattern = /^\d{10}$/;

// Error span element
var rechargePhoneError = document.getElementById("rechargePhoneError");

// Input field
var rechargePhone = document.getElementById("rechargePhone");

// Form submission
var rechargeForm = document.getElementById("rechargeForm");

// Store registered users & customer details
var customerData = {};

// Fetch customer details from JSON
fetch("./customer_details_json/customers.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(customer => {
      customerData[customer.mobile.trim()] = customer; // Store customer details indexed by mobile number
    });
  })
  .catch(error => console.error("Error loading customer data:", error));

// Event Listener for Form Submission
rechargeForm.addEventListener("submit", function (event) {
    var phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, ""); // Remove spaces

    // Validate the form with the collected values
    if (!validateRechargeForm(phoneNumberValue)) {
        event.preventDefault();
    } else {
        // If valid, store customer details in sessionStorage
        sessionStorage.setItem("currentCustomer", JSON.stringify(customerData[phoneNumberValue]));
    }
});

// On input change, show error message dynamically
rechargePhone.addEventListener("input", function () {
    var phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, ""); // Remove spaces
    validateRechargeForm(phoneNumberValue); // Show validation error while typing
});

// Validation Function
function validateRechargeForm(phoneNumberValue) {
    var isValid = true;

    // Clear previous error messages
    rechargePhoneError.innerHTML = "";

    // If empty
    if (phoneNumberValue === "") {
        rechargePhoneError.innerHTML = "📢 Phone Number is required.";
        isValid = false;
    } 
    // If non-numeric characters are included
    else if (!/^\d*$/.test(phoneNumberValue)) {
        rechargePhoneError.innerHTML = "⚠️ Enter only digits (0-9).";
        isValid = false;
    } 
    // If less than 10 digits
    else if (phoneNumberValue.length < 10) {
        rechargePhoneError.innerHTML = "⚠️ Enter a valid 10-digit phone number.";
        isValid = false;
    } 
    // If exactly 10 digits, check registration
    else if (phoneNumberValue.length === 10) {
        if (!(phoneNumberValue in customerData)) {
            rechargePhoneError.innerHTML = "🚫 You are not a registered user of Mobi-Comm.";
            isValid = false;
        }
    } 
    // If more than 10 digits
    else if (phoneNumberValue.length > 10) {
        rechargePhoneError.innerHTML = "❌ Phone number should be 10 digits long.";
        isValid = false;
    }

    return isValid;
}

