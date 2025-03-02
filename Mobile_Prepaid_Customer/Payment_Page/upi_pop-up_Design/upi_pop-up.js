// UPI ID Validation JS

// UPI ID regex pattern (supports formats like "example@upi", "name@okicici", "phone@paytm", etc.)
var upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

// Error span element
var upiError = document.getElementById("upiError");

// Input field
var upiInput = document.getElementById("upi-id");

// Form submission
var upiForm = document.getElementById("upiForm");

// Event Listener for Form Submission
upiForm.addEventListener("submit", function (event) {
    var upiValue = upiInput.value.trim();

    // Validate the form with the collected values
    if (!validateUpiForm(upiValue)) {
        event.preventDefault(); 
    }
});

// On input change, remove error message
upiInput.addEventListener("input", function () {
    upiError.innerHTML = "";
});

// Validation Function
function validateUpiForm(upiValue) {
    var isValid = true;

    // UPI ID Validation
    if (upiValue === "") {
        upiError.innerHTML = "UPI ID is required.";
        isValid = false;
    }
    else if (!upiPattern.test(upiValue)) {
        upiError.innerHTML = "Enter a valid UPI ID (example: name@upi).";
        isValid = false;
    }

    return isValid;
}

// Function to append predefined UPI extensions to input
function appendUpi(upiSuffix) {
    var currentValue = upiInput.value.trim();
    if (!currentValue.includes("@")) {
        upiInput.value = currentValue + upiSuffix;
    }
}
