// Card Payment Validation

// Regex patterns
var cardNumberPattern = /^\d{16}$/;  // 16-digit card number
var expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
var cvvPattern = /^\d{3,4}$/; // 3 or 4-digit CVV
var cardholderNamePattern = /^[a-zA-Z\s]{3,30}$/; // Name with alphabets only

// Error span elements
var cardNumberError = document.getElementById("cardNumberError");
var expiryDateError = document.getElementById("expiryDateError");
var cvvError = document.getElementById("cvvError");
var cardholderNameError = document.getElementById("cardholderNameError");

// Input fields
var cardNumber = document.getElementById("card-number");
var expiryDate = document.getElementById("expiry-date");
var cvv = document.getElementById("cvv");
var cardholderName = document.getElementById("cardholder-name");

// Form submission
var cardPaymentForm = document.getElementById("cardPaymentForm");

// Event Listener for Form Submission
cardPaymentForm.addEventListener("submit", function (event) {
    var isValid = validateCardPaymentForm();

    // Prevent form submission if validation fails
    if (!isValid) {
        event.preventDefault();
    }
});

// On input change, remove error messages
cardNumber.addEventListener("input", () => cardNumberError.innerHTML = "");
expiryDate.addEventListener("input", () => expiryDateError.innerHTML = "");
cvv.addEventListener("input", () => cvvError.innerHTML = "");
cardholderName.addEventListener("input", () => cardholderNameError.innerHTML = "");

// Validation Function
function validateCardPaymentForm() {
    var isValid = true;

    // Card Number Validation
    if (cardNumber.value.trim() === "") {
        cardNumberError.innerHTML = "Card number is required.";
        isValid = false;
    } else if (!cardNumberPattern.test(cardNumber.value.trim())) {
        cardNumberError.innerHTML = "Enter a valid 16-digit card number.";
        isValid = false;
    }

    // Expiry Date Validation
    if (expiryDate.value.trim() === "") {
        expiryDateError.innerHTML = "Expiry date is required.";
        isValid = false;
    } else if (!expiryDatePattern.test(expiryDate.value.trim())) {
        expiryDateError.innerHTML = "Enter expiry date in MM/YY format.";
        isValid = false;
    }

    // CVV Validation
    if (cvv.value.trim() === "") {
        cvvError.innerHTML = "CVV is required.";
        isValid = false;
    } else if (!cvvPattern.test(cvv.value.trim())) {
        cvvError.innerHTML = "Enter a valid 3 or 4-digit CVV.";
        isValid = false;
    }

    // Cardholder Name Validation
    if (cardholderName.value.trim() === "") {
        cardholderNameError.innerHTML = "Cardholder name is required.";
        isValid = false;
    } else if (!cardholderNamePattern.test(cardholderName.value.trim())) {
        cardholderNameError.innerHTML = "Enter a valid name (only alphabets).";
        isValid = false;
    }

    return isValid;
}
