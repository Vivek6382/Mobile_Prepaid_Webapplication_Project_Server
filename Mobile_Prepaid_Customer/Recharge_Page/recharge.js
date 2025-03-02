    // Profile-DropDown-JS

    document.addEventListener("DOMContentLoaded", function () {
      const userDropdown = document.querySelector(".user-dropdown");
      const dropdownContent = document.querySelector(".dropdown-content");
      const userIcon = document.getElementById("userIcon"); // User icon
      const signOutBtn = document.getElementById("signOutBtn"); // Sign-out button
  
      function updateDropdown() {
          const currentCustomer = sessionStorage.getItem("currentCustomer");
  
          if (currentCustomer) {
              // Show dropdown when user icon is clicked
              userIcon.onclick = function (event) {
                  event.stopPropagation();
                  dropdownContent.classList.toggle("active");
              };
  
              // Ensure dropdown is visible
              dropdownContent.style.display = "block";
  
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
              dropdownContent.style.display = "none";
          }
      }
  
      // Initialize dropdown behavior
      updateDropdown();
  
      // Close dropdown when clicking outside
      document.addEventListener("click", function (event) {
          if (!userDropdown.contains(event.target)) {
              dropdownContent.classList.remove("active");
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
  var phonePattern = /^\d{10}$/; // 10-digit validation
  var mobileError = document.getElementById("mobileError");
  var mobileInput = document.getElementById("mobile");
  var generateOtpButton = document.getElementById("generateOtp");

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
});






// The OTP-Js

document.addEventListener("DOMContentLoaded", function () {
  let time = 30;
  const timerElement = document.getElementById("timer");
  const resendLink = document.getElementById("resendLink");
  const otpInputs = document.querySelectorAll(".otp-input");
  const otpPopup = document.getElementById("otpPopup");
  const otpOverlay = document.getElementById("otpOverlay");
  const closePopup = document.getElementById("closePopup");
  const otpForm = document.getElementById("otp-form");

  function startTimer() {
      time = 30; // Reset timer
      timerElement.style.visibility = "visible"; // Show timer
      const countdown = setInterval(() => {
          time--;
          const minutes = Math.floor(time / 60);
          const seconds = time % 60;
          timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

          if (time <= 0) {
              clearInterval(countdown);
              timerElement.style.visibility = "hidden"; // Hide timer when it reaches 0
          }
      }, 1000);
  }

  // Function to Open OTP Pop-up
  function openOtpPopup() {
      otpPopup.classList.add("active");
      otpOverlay.classList.add("active");
      startTimer(); // Start the timer when OTP opens
  }

  // Function to Close OTP Pop-up
  function closeOtpPopup() {
      otpPopup.classList.remove("active");
      otpOverlay.classList.remove("active");
  }

  // Close button functionality
  closePopup.addEventListener("click", closeOtpPopup);

  // OTP input handling (Auto-focus next input)
  otpInputs.forEach((input, index) => {
      input.addEventListener("input", () => {
          if (input.value.length === 1 && index < otpInputs.length - 1) {
              otpInputs[index + 1].focus();
          }
      });

      input.addEventListener("keydown", (e) => {
          if (e.key === "Backspace" && !input.value && index > 0) {
              otpInputs[index - 1].focus();
          }
      });
  });

  // Resend OTP functionality
  resendLink.addEventListener("click", () => {
      otpInputs.forEach(input => input.value = ""); // Clear inputs
      startTimer(); // Restart timer
  });

  // OTP Form Validation before Submission
  otpForm.addEventListener("submit", function (event) {
      let otpValue = "";
      otpInputs.forEach(input => {
          otpValue += input.value;
      });

      if (otpValue.length !== 6) {
          event.preventDefault();
          alert("Please enter all 6 digits of the OTP.");
      }
  });

  // Open OTP Pop-up when required (If you have a button to trigger OTP, call `openOtpPopup()`)
});
