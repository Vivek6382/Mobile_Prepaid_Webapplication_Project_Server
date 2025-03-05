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

// Mobile Validation & OTP Pop-up Integration with JSON-based Quick Recharge Validation

document.addEventListener("DOMContentLoaded", function () {
    var phonePattern = /^\d{10}$/;
    var mobileError = document.getElementById("mobileError");
    var mobileInput = document.getElementById("mobile");
    var generateOtpButton = document.getElementById("generateOtp");
    var verifyOtpButton = document.querySelector(".validate-btn");

    // OTP Pop-up elements
    var otpPopup = document.getElementById("otpPopup");
    var otpOverlay = document.getElementById("otpOverlay");
    var closePopup = document.getElementById("closePopup");
    var otpMessage = document.querySelector(".otp-message strong");
    var otpError = document.getElementById("otpError");

    // OTP Side Notification
    var notificationContainer = document.createElement("div");
    notificationContainer.classList.add("notification-container");
    document.body.appendChild(notificationContainer);

    var customerData = {};
    var generatedOTP = ""; // Store generated OTP

    // Fetch customer details from JSON
    fetch("/Mobile_Prepaid_Customer/Discover_Page/customer_details_json/customers.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(customer => {
                customerData[customer.mobile.trim()] = customer;
            });
        })
        .catch(error => console.error("Error loading customer data:", error));

    mobileInput.addEventListener("input", function () {
        var phoneNumberValue = mobileInput.value.trim().replace(/\s+/g, "");
        validateRechargeForm(phoneNumberValue);
    });

    generateOtpButton.addEventListener("click", function (event) {
        event.preventDefault();
        var phoneNumberValue = mobileInput.value.trim().replace(/\s+/g, "");

        if (validateRechargeForm(phoneNumberValue)) {
            generatedOTP = generateRandomOTP(); // Generate new OTP
            showNotification(`OTP ${generatedOTP} sent successfully`); // Show OTP sent notification
            openOtpPopup(phoneNumberValue); // Show OTP entry pop-up
        }
    });

    function validateRechargeForm(phoneNumberValue) {
        var isValid = true;
        mobileError.innerHTML = "";

        if (phoneNumberValue === "") {
            mobileError.innerHTML = "📢 Phone Number is required.";
            isValid = false;
        } else if (!/^\d*$/.test(phoneNumberValue)) {
            mobileError.innerHTML = "⚠️ Enter only digits (0-9).";
            isValid = false;
        } else if (phoneNumberValue.length < 10) {
            mobileError.innerHTML = "⚠️ Enter a valid 10-digit phone number.";
            isValid = false;
        } else if (!(phoneNumberValue in customerData)) {
            mobileError.innerHTML = "🚫 You are not a registered user of Mobi-Comm.";
            isValid = false;
        }

        return isValid;
    }

    function openOtpPopup(phoneNumber) {
        otpPopup.classList.add("active");
        otpOverlay.classList.add("active");
        otpMessage.textContent = `******${phoneNumber.slice(-4)}`; // Update phone in message
        otpError.textContent = ""; // Clear OTP error
        otpInputs.forEach(input => input.value = ""); // Clear previous OTP inputs
        otpInputs[0].focus();
        startOtpTimer(30);
    }

    closePopup.addEventListener("click", function () {
        otpPopup.classList.remove("active");
        otpOverlay.classList.remove("active");
    });

    function generateRandomOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    var otpInputs = document.querySelectorAll(".otp-input");

    otpInputs.forEach((input, index) => {
        input.addEventListener("input", function (event) {
            if (!/^\d$/.test(this.value)) {
                this.value = ""; // Only allow digits
                return;
            }
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Backspace" && index > 0 && this.value === "") {
                otpInputs[index - 1].focus();
            }
        });

        input.addEventListener("paste", function (event) {
            event.preventDefault();
            var pasteData = event.clipboardData.getData("text").trim();
            if (/^\d{6}$/.test(pasteData)) {
                otpInputs.forEach((input, i) => {
                    input.value = pasteData[i] || "";
                });
                otpInputs[5].focus();
            }
        });
    });

    var timerElement = document.getElementById("timer");
    var resendLink = document.getElementById("resendLink");

    function startOtpTimer(durationInSeconds) {
        var timeLeft = durationInSeconds;
        resendLink.style.display = "none";
        timerElement.style.display = "block";
        var countdown = setInterval(function () {
            var minutes = Math.floor(timeLeft / 60);
            var seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                resendLink.style.display = "inline";
                timerElement.style.display = "none";
            } else {
                timeLeft--;
            }
        }, 1000);
    }

    resendLink.addEventListener("click", function () {
        generatedOTP = generateRandomOTP();
        showNotification(`OTP ${generatedOTP} sent successfully`);
        startOtpTimer(30);
    });

    verifyOtpButton.addEventListener("click", function (event) {
        event.preventDefault();
        var enteredOtp = Array.from(otpInputs).map(input => input.value).join("");

        otpError.innerHTML = ""; // Clear previous error

        if (enteredOtp.length < 6) {
            otpError.innerHTML = "⚠️ Please enter all 6 digits.";
            return;
        }

        if (enteredOtp !== generatedOTP) {
            otpError.innerHTML = "🚫 The OTP entered is incorrect. Please try again.";
            return;
        }

        sessionStorage.setItem("currentCustomer", JSON.stringify(customerData[mobileInput.value.trim()]));
        window.location.href = "/Mobile_Prepaid_Customer/Prepaid_plans_Page/Popular_plans/prepaid.html";
    });

    function showNotification(message) {
        var notification = document.createElement("div");
        notification.classList.add("notification");
        notification.innerHTML = `<div class="icon">✔</div>
                                  <div class="notification-text">${message}</div>
                                  <button class="close-btn">&times;</button>`;

        notification.querySelector(".close-btn").addEventListener("click", function () {
            notification.remove();
        });

        notificationContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 10000); // Increased time to 10 seconds
    }
});








