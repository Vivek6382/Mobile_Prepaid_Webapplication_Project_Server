
  // Profile-DropDown-JS

  document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.querySelector(".user-dropdown");
    const dropdownContent = document.querySelector(".dropdown-content");
  
    userDropdown.addEventListener("click", function (event) {
      event.stopPropagation();
      userDropdown.classList.toggle("active");
    });
  
    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      if (!userDropdown.contains(event.target)) {
        userDropdown.classList.remove("active");
      }
    });
  });




  // Validate-Admin-Login-Js

  // Patterns for Validation
var userNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/;
var adminCodePattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\W]).{8,}$/;

// Error span elements (to show validation errors)
var usernameSpanError = document.getElementById("usernameSpanError");
var adminCodeSpanError = document.getElementById("adminCodeSpanError");

// Input fields
var username = document.getElementById("username");
var adminCode = document.getElementById("adminCode");

// Form reference
var form = document.querySelector("form"); // Select the form inside your card

// Event Listener for Form Submission
form.addEventListener("submit", function (event) {
    var usernameValue = username.value.trim();
    var adminCodeValue = adminCode.value.trim();

    if (!validateForm(usernameValue, adminCodeValue)) {
        event.preventDefault(); // Stop form submission if validation fails
    }
});

// On-Input Change (Clear Errors on Typing)
username.addEventListener("input", function () {
    usernameSpanError.innerHTML = "";
});

adminCode.addEventListener("input", function () {
    adminCodeSpanError.innerHTML = "";
});

// Validation Function
function validateForm(usernameValue, adminCodeValue) {
    var isValid = true;

    // Username Validation
    if (usernameValue === "") {
        usernameSpanError.innerHTML = "Username is required.";
        isValid = false;
    } else if (!userNamePattern.test(usernameValue)) {
        usernameSpanError.innerHTML = "Invalid username format.";
        isValid = false;
    }

    // Admin Code Validation
    if (adminCodeValue === "") {
        adminCodeSpanError.innerHTML = "Admin Special Code is required.";
        isValid = false;
    } else if (!adminCodePattern.test(adminCodeValue)) {
        adminCodeSpanError.innerHTML = "Invalid admin code format.";
        isValid = false;
    }

    return isValid;
}
