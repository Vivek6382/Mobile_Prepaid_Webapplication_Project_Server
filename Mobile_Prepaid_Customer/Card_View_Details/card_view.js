// Mobile-Validation-Js

// Phone number regex pattern (strictly requires 10 digits)
var phonePattern = /^\d{10}$/;

// Error span element (optional, add in HTML if needed)
var mobileError = document.getElementById("mobileError");

// Input field
var mobileNumber = document.getElementById("mobileNumber");

// Form submission
var mobileForm = document.getElementById("mobileForm");

// Event Listener for Form Submission
mobileForm.addEventListener("submit", function (event) {
    var phoneNumberValue = mobileNumber.value.trim();

    // Validate the form with the collected values
    if (!validateMobileForm(phoneNumberValue)) {
        event.preventDefault(); 
    }
});

// On input change, remove error message
mobileNumber.addEventListener("input", function () {
    if (mobileError) {
        mobileError.innerHTML = "";
    }
});

// Validation Function
function validateMobileForm(phoneNumberValue) {
    var isValid = true;

    // Phone Number Validation
    if (phoneNumberValue === "") {
        if (mobileError) {
            mobileError.innerHTML = "Phone Number is required.";
        }
        isValid = false;
    } 
    else if (!phonePattern.test(phoneNumberValue)) {
        if (mobileError) {
            mobileError.innerHTML = "Enter a valid 10-digit phone number.";
        }
        isValid = false;
    }

    return isValid;
}
