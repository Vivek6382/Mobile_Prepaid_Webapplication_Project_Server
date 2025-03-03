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

  





// Mobile Validation & OTP Pop-up Integration with JSON-based Quick Recharge Validation

document.addEventListener("DOMContentLoaded", function () {
    var phonePattern = /^\d{10}$/; // 10-digit validation
    var mobileError = document.getElementById("mobileError");
    var mobileInput = document.getElementById("mobile");
    var generateOtpButton = document.getElementById("generateOtp");
    var verifyOtpButton = document.querySelector(".validate-btn"); // OTP Verify Button

    // OTP Pop-up elements
    var otpPopup = document.getElementById("otpPopup");
    var otpOverlay = document.getElementById("otpOverlay");
    var closePopup = document.getElementById("closePopup");

    // Store registered users & customer details
    var customerData = {};

    // Fetch customer details from JSON
    fetch("/Mobile_Prepaid_Customer/Discover_Page/customer_details_json/customers.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(customer => {
                customerData[customer.mobile.trim()] = customer; // Store customer details indexed by mobile number
            });
        })
        .catch(error => console.error("Error loading customer data:", error));

    // Show validation error dynamically as user types
    mobileInput.addEventListener("input", function () {
        var phoneNumberValue = mobileInput.value.trim().replace(/\s+/g, ""); // Remove spaces
        validateRechargeForm(phoneNumberValue);
    });

    // Form submission validation & OTP pop-up handling
    generateOtpButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default form submission
        var phoneNumberValue = mobileInput.value.trim().replace(/\s+/g, ""); // Remove spaces

        if (validateRechargeForm(phoneNumberValue)) {
            openOtpPopup(phoneNumberValue); // Show OTP pop-up
        }
    });

    // Validation Function
    function validateRechargeForm(phoneNumberValue) {
        var isValid = true;
        mobileError.innerHTML = ""; // Clear previous error messages

        if (phoneNumberValue === "") {
            mobileError.innerHTML = "📢 Phone Number is required.";
            isValid = false;
        } else if (!/^\d*$/.test(phoneNumberValue)) {
            mobileError.innerHTML = "⚠️ Enter only digits (0-9).";
            isValid = false;
        } else if (phoneNumberValue.length < 10) {
            mobileError.innerHTML = "⚠️ Enter a valid 10-digit phone number.";
            isValid = false;
        } else if (phoneNumberValue.length === 10) {
            if (!(phoneNumberValue in customerData)) {
                mobileError.innerHTML = "🚫 You are not a registered user of Mobi-Comm.";
                isValid = false;
            }
        } else if (phoneNumberValue.length > 10) {
            mobileError.innerHTML = "❌ Phone number should be 10 digits long.";
            isValid = false;
        }

        return isValid;
    }

    // Function to Open OTP Pop-up
    function openOtpPopup(phoneNumber) {
        otpPopup.classList.add("active");
        otpOverlay.classList.add("active");
        startOtpTimer(30); // Start OTP timer when pop-up opens
    }

    // Function to Close OTP Pop-up
    closePopup.addEventListener("click", function () {
        otpPopup.classList.remove("active");
        otpOverlay.classList.remove("active");
    });

    // OTP Input Handling (Auto-focus next field)
    var otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach((input, index) => {
        input.addEventListener("input", function () {
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Backspace" && index > 0 && this.value === "") {
                otpInputs[index - 1].focus();
            }
        });
    });

    // OTP Timer Countdown
    var timerElement = document.getElementById("timer");
    var resendLink = document.getElementById("resendLink");
    function startOtpTimer(durationInSeconds) {
        var timeLeft = durationInSeconds;
        resendLink.style.display = "none"; // Hide resend link initially
        timerElement.style.display = "block"; // Show timer
        var countdown = setInterval(function () {
            var minutes = Math.floor(timeLeft / 60);
            var seconds = timeLeft % 60;
            timerElement.textContent =
                (minutes < 10 ? "0" : "") +
                minutes +
                ":" +
                (seconds < 10 ? "0" : "") +
                seconds;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                resendLink.style.display = "inline";
                timerElement.style.display = "none";
            } else {
                timeLeft--;
            }
        }, 1000);
    }

    // Resend OTP Functionality
    resendLink.addEventListener("click", function () {
        resendLink.style.display = "none";
        timerElement.style.display = "block";
        startOtpTimer(30);
    });

    // Verify OTP Button Click
    verifyOtpButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default form submission

        var phoneNumberValue = mobileInput.value.trim().replace(/\s+/g, ""); // Remove spaces
        if (!validateRechargeForm(phoneNumberValue)) {
            return;
        }

        // Simulate OTP validation (You can replace this with actual OTP check logic)
        var otpInputs = document.querySelectorAll(".otp-input");
        var enteredOtp = Array.from(otpInputs).map(input => input.value).join("");

        if (enteredOtp.length !== otpInputs.length || !/^\d{4,6}$/.test(enteredOtp)) {
            alert("⚠️ Invalid OTP. Please enter a valid OTP.");
            return;
        }

        // Store customer details in sessionStorage
        sessionStorage.setItem("currentCustomer", JSON.stringify(customerData[phoneNumberValue]));

        // Redirect to prepaid page after successful OTP verification
        window.location.href = "/Mobile_Prepaid_Customer/Prepaid_plans_Page/Popular_plans/prepaid.html";
    });
});






