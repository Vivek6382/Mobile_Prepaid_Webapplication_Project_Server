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








// Mobile-Validation-Js with Backend Authentication

var phonePattern = /^\d{10}$/;
var rechargePhoneError = document.getElementById("rechargePhoneError");
var rechargePhone = document.getElementById("rechargePhone");
var rechargeForm = document.getElementById("rechargeForm");

// API Endpoints
const LOGIN_URL = "http://localhost:8083/auth/login";
const PROFILE_URL = "http://localhost:8083/auth/profile";

// Event Listener for Form Submission
rechargeForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, "");
    
    if (!validateRechargeForm(phoneNumberValue)) return;
    
    try {
        // Login API Request
        let loginResponse = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile: phoneNumberValue })
        });

        if (!loginResponse.ok) {
            throw new Error("Login failed. Invalid credentials.");
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
            throw new Error("Failed to fetch user profile.");
        }

        let userProfile = await profileResponse.json();
        sessionStorage.setItem("currentCustomer", JSON.stringify(userProfile));

        // Redirect after successful login & profile retrieval
        window.location.href = "/Mobile_Prepaid_Customer/Prepaid_plans_Page/Popular_plans/prepaid.html";
    } catch (error) {
        rechargePhoneError.innerHTML = `🚫 ${error.message}`;
    }
});

// Dynamic Error Display on Input Change
rechargePhone.addEventListener("input", function () {
    var phoneNumberValue = rechargePhone.value.trim().replace(/\s+/g, "");
    validateRechargeForm(phoneNumberValue);
});

// Validation Function
function validateRechargeForm(phoneNumberValue) {
    rechargePhoneError.innerHTML = "";
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
        rechargePhoneError.innerHTML = "❌ Phone number should be 10 digits long.";
        return false;
    }
    return true;
}






