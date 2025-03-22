// Ensure script runs after DOM is loaded
// Ensure script runs after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const currentPlan = JSON.parse(sessionStorage.getItem("currentPlan"));

  if (!currentPlan) return; // Exit if no plan found in session storage

  // Update payment summary section dynamically
  document.getElementById("planName").textContent = currentPlan.planName || "-";
  document.getElementById("planPrice").textContent =
    `₹${currentPlan.price}/month` || "-";
  document.getElementById("planValidity").textContent =
    `${currentPlan.validity} Days` || "-";
  document.getElementById("totalAmount").textContent =
    `₹${currentPlan.price}` || "-";

  const planDetails = document.getElementById("planDetails");

  // Plan Benefits Section
  let benefitsHTML = "";
  let benefitsTable = "";

  if (currentPlan.dailyData) {
    benefitsTable += `<tr><td>Daily Data</td><td class="amount">${currentPlan.dailyData}</td></tr>`;
  }
  if (currentPlan.totalData) {
    benefitsTable += `<tr><td>Total Data</td><td class="amount">${currentPlan.totalData}</td></tr>`;
  }
  if (currentPlan.voice) {
    benefitsTable += `<tr><td>Voice</td><td class="amount">${currentPlan.voice}</td></tr>`;
  }
  if (currentPlan.sms) {
    benefitsTable += `<tr><td>SMS</td><td class="amount">${currentPlan.sms}</td></tr>`;
  }

  if (benefitsTable) {
    benefitsHTML = `
            <h3>Plan Benefits</h3>
            <table class="plan-table">${benefitsTable}</table>
        `;
  }

  // OTT Benefits Section
  let ottHTML = "";
  if (currentPlan.ott && currentPlan.ott.length > 0) {
    const ottLogos = {
      Netflix: "./assets/Ott_Logos/Netflix_Logo.svg",
      "Amazon Prime": "./assets/Ott_Logos/Prime_Logo.svg",
      "Sony LIV": "./assets/Ott_Logos/Sony_Logo.svg",
      "Sun NXT": "./assets/Ott_Logos/Sun_nxt_Logo.svg",
      Zee5: "./assets/Ott_Logos/Zee5_Logo.svg",
    };

    let ottItems = currentPlan.ott
      .map((ott) =>
        ottLogos[ott]
          ? `<div class="ott"><img src="${ottLogos[ott]}" alt="${ott}"></div>`
          : ""
      )
      .join("");

    if (ottItems) {
      ottHTML = `<h3>OTT Benefits</h3><div class="ott-list">${ottItems}</div>`;
    }
  }

  // Terms & Conditions Section
  let termsHTML = "";
  if (currentPlan.terms && currentPlan.terms.length > 0) {
    let termsList = currentPlan.terms
      .map((term) => `<li>${term}</li>`)
      .join("");
    termsHTML = `<h3 class="terms">Terms & Conditions</h3><ul>${termsList}</ul>`;
  }

  // Inject only into the expandable section
  planDetails.innerHTML = benefitsHTML + ottHTML + termsHTML;
});

// Toggle Details Function
function toggleDetails() {
  document.getElementById("planDetails").classList.toggle("show");
}







// Payment-Section-Accordion

// Payment-Section-Accordion

// Card Payment Handling
document.addEventListener("DOMContentLoaded", function () {
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  const upiOptions = document.querySelectorAll("input[name='upi']");
  const cardPaymentOption = document.getElementById("card_payment");
  const upiCloseButton = document.querySelector(".close-link");
  const cardCloseButton = document.querySelector("#cardPaymentOverlay .close-link");
  
  // Form elements
  const cardNumberInput = document.getElementById("card-number");
  const expiryDateInput = document.getElementById("expiry-date");
  const cvvInput = document.getElementById("cvv");
  const cardholderNameInput = document.getElementById("cardholder-name");
  
  // Error elements
  const cardNumberError = document.getElementById("cardNumberError");
  const expiryDateError = document.getElementById("expiryDateError");
  const cvvError = document.getElementById("cvvError");
  const cardholderNameError = document.getElementById("cardholderNameError");
  
  // Form
  const cardPaymentForm = document.getElementById("cardPaymentForm");
  
  // UPI Elements
  const upiInput = document.getElementById("upi-id");
  const upiError = document.getElementById("upiError");
  const upiForm = document.getElementById("upiForm");
  const upiButtons = document.querySelectorAll(".upi-option");
  
  // UPI ID regex pattern
  const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

  // ✅ Accordion Toggle Function
  function toggleAccordion(header) {
      let content = header.nextElementSibling;
      let icon = header.querySelector(".accordion-icon");

      document.querySelectorAll(".accordion-content").forEach((acc) => {
          if (acc !== content) {
              acc.style.maxHeight = "0";
              acc.classList.remove("active");
          }
      });

      document.querySelectorAll(".accordion-icon").forEach((ic) => {
          if (ic !== icon) ic.textContent = "+";
      });

      if (content.classList.toggle("active")) {
          content.style.maxHeight = content.scrollHeight + "px";
          icon.textContent = "-";
      } else {
          content.style.maxHeight = "0";
          icon.textContent = "+";
      }
  }

  // ✅ Attach accordion event listeners
  accordionHeaders.forEach((header) => {
      header.addEventListener("click", () => toggleAccordion(header));
  });

  // ✅ UPI Popup Functions
  function showUpiPopup() {
      let overlay = document.getElementById("upiOverlay");
      if (overlay) overlay.classList.add("active");
      
      // Reset form
      if (upiInput) {
          upiInput.value = "";
          upiInput.placeholder = "Enter UPI ID";
          upiError.innerHTML = "";
      }
  }

  function closeUpiPopup() {
      let overlay = document.getElementById("upiOverlay");
      if (overlay) overlay.classList.remove("active");
      
      // Reset form
      if (upiInput) {
          upiInput.value = "";
          upiError.innerHTML = "";
      }
  }

  // ✅ Card Payment Popup Functions
  function showCardPaymentPopup() {
      let overlay = document.getElementById("cardPaymentOverlay");
      if (overlay) overlay.classList.add("active");
      
      // Reset form
      if (cardPaymentForm) {
          cardPaymentForm.reset();
          cardNumberError.innerHTML = "";
          expiryDateError.innerHTML = "";
          cvvError.innerHTML = "";
          cardholderNameError.innerHTML = "";
      }
  }

  function closeCardPaymentPopup() {
      let overlay = document.getElementById("cardPaymentOverlay");
      if (overlay) overlay.classList.remove("active");
      
      // Uncheck radio button
      if (cardPaymentOption) {
          cardPaymentOption.checked = false;
      }
  }

  // ✅ Append UPI suffix to input field
  function appendUpi(upiSuffix) {
      let currentValue = upiInput.value.trim();
      
      if (currentValue.length === 0) return;
      
      currentValue = currentValue.replace(/@\w+$/, "");
      upiInput.value = currentValue + upiSuffix;
      upiInput.focus();
      
      validateUpiForm(upiInput.value.trim());
  }

  // ✅ UPI ID Validation Function
  function validateUpiForm(upiValue) {
      let isValid = true;
      
      if (upiValue === "") {
          upiError.innerHTML = "<strong>⚠️ UPI ID is required.</strong>";
          upiError.style.color = "red";
          isValid = false;
      } else if (!upiPattern.test(upiValue)) {
          upiError.innerHTML = "<strong>❌ Enter a valid UPI ID (example: name@upi).</strong>";
          upiError.style.color = "red";
          isValid = false;
      } else {
          upiError.innerHTML = "<strong>✅ Looks good!</strong>";
          upiError.style.color = "green";
      }
      
      return isValid;
  }

  // ✅ Event listeners for radio buttons
  upiOptions.forEach((option) => {
      option.addEventListener("click", function () {
          if (this.checked && this.id !== "card_payment") {
              showUpiPopup();
              // Close card payment popup if open
              closeCardPaymentPopup();
          }
      });
  });

  // ✅ Event listener for card payment option
  if (cardPaymentOption) {
      cardPaymentOption.addEventListener("click", function() {
          if (this.checked) {
              showCardPaymentPopup();
              // Close UPI popup if open
              closeUpiPopup();
          }
      });
  }

  // ✅ Close button event listeners
  if (upiCloseButton) {
      upiCloseButton.addEventListener("click", function() {
          closeUpiPopup();
          // Uncheck all UPI options
          document.querySelectorAll("input[name='upi']").forEach((radio) => {
              radio.checked = false;
          });
      });
  }

  if (cardCloseButton) {
      cardCloseButton.addEventListener("click", closeCardPaymentPopup);
  }
  
  // ✅ UPI button event listeners
  if (upiButtons) {
      upiButtons.forEach((button) => {
          button.addEventListener("click", function() {
              appendUpi(this.textContent.trim());
          });
      });
  }
  
  // ✅ UPI input validation on change
  if (upiInput) {
      upiInput.addEventListener("input", function() {
          validateUpiForm(this.value.trim());
      });
  }

  // ✅ Card Number Formatting
  if (cardNumberInput) {
      cardNumberInput.addEventListener("input", function() {
          // Remove any non-digit characters
          let value = this.value.replace(/\D/g, '');
          
          // Add space after every 4 digits
          let formattedValue = '';
          for (let i = 0; i < value.length; i++) {
              if (i > 0 && i % 4 === 0) {
                  formattedValue += ' ';
              }
              formattedValue += value[i];
          }
          
          // Limit to 16 digits + spaces
          this.value = formattedValue.slice(0, 19);
          
          // Validate as user types
          validateCardNumber(this.value);
      });
  }

  // ✅ Expiry Date Formatting
  if (expiryDateInput) {
      expiryDateInput.addEventListener("input", function() {
          let value = this.value.replace(/\D/g, '');
          
          // Format as MM/YY
          if (value.length > 0) {
              if (value.length <= 2) {
                  this.value = value;
              } else {
                  this.value = value.slice(0, 2) + '/' + value.slice(2, 4);
              }
          }
          
          // Validate as user types
          validateExpiryDate(this.value);
      });
  }

  // ✅ CVV Validation
  if (cvvInput) {
      cvvInput.addEventListener("input", function() {
          this.value = this.value.replace(/\D/g, '').slice(0, 3);
          validateCVV(this.value);
      });
  }

  // ✅ Cardholder Name Validation
  if (cardholderNameInput) {
      cardholderNameInput.addEventListener("input", function() {
          validateCardholderName(this.value);
      });
  }

  // ✅ Form Submission - UPI
  if (upiForm) {
      upiForm.addEventListener("submit", function(event) {
          // Prevent default form submission behavior immediately
          event.preventDefault();
          
          let upiValue = upiInput.value.trim();
          
          if (!validateUpiForm(upiValue)) {
              return;
          }
          
          // Store transaction details
          storeTransactionDetails("UPI");
          
          // Then manually redirect to success page
          window.location.href = "/Mobile_Prepaid_Customer/Payment-Status_Page/Payment-Success_Page/payment_success.html";
      });
  }

  // ✅ Form Submission - Card
  if (cardPaymentForm) {
      cardPaymentForm.addEventListener("submit", function(event) {
          // Prevent default form submission behavior immediately
          event.preventDefault();
          
          const cardNumber = cardNumberInput.value.trim();
          const expiryDate = expiryDateInput.value.trim();
          const cvv = cvvInput.value.trim();
          const cardholderName = cardholderNameInput.value.trim();
          
          let isValid = true;
          
          // Validate all fields
          if (!validateCardNumber(cardNumber)) isValid = false;
          if (!validateExpiryDate(expiryDate)) isValid = false;
          if (!validateCVV(cvv)) isValid = false;
          if (!validateCardholderName(cardholderName)) isValid = false;
          
          if (!isValid) {
              return;
          }
          
          // Store transaction details
          storeTransactionDetails("CARD");
          
          // Then manually redirect to success page
          window.location.href = "/Mobile_Prepaid_Customer/Payment-Status_Page/Payment-Success_Page/payment_success.html";
      });
  }

  // ✅ Validation Functions
  function validateCardNumber(cardNumber) {
      const strippedNumber = cardNumber.replace(/\s/g, '');
      const isValid = /^[0-9]{16}$/.test(strippedNumber);
      
      if (cardNumber === '') {
          cardNumberError.innerHTML = "<strong>⚠️ Card number is required.</strong>";
          cardNumberError.style.color = "red";
          return false;
      } else if (!isValid) {
          cardNumberError.innerHTML = "<strong>❌ Enter a valid 16-digit card number.</strong>";
          cardNumberError.style.color = "red";
          return false;
      } else {
          cardNumberError.innerHTML = "<strong>✅ Looks good!</strong>";
          cardNumberError.style.color = "green";
          return true;
      }
  }

  function validateExpiryDate(expiryDate) {
      const isFormatValid = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate);
      
      if (expiryDate === '') {
          expiryDateError.innerHTML = "<strong>⚠️ Expiry date is required.</strong>";
          expiryDateError.style.color = "red";
          return false;
      } else if (!isFormatValid) {
          expiryDateError.innerHTML = "<strong>❌ Enter a valid date (MM/YY).</strong>";
          expiryDateError.style.color = "red";
          return false;
      } else {
          // Check if card is expired
          const [month, year] = expiryDate.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
          const currentMonth = currentDate.getMonth() + 1; // 1-12
          
          if (parseInt(year) < currentYear || 
              (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
              expiryDateError.innerHTML = "<strong>❌ Card has expired.</strong>";
              expiryDateError.style.color = "red";
              return false;
          } else {
              expiryDateError.innerHTML = "<strong>✅ Looks good!</strong>";
              expiryDateError.style.color = "green";
              return true;
          }
      }
  }

  function validateCVV(cvv) {
      const isValid = /^[0-9]{3}$/.test(cvv);
      
      if (cvv === '') {
          cvvError.innerHTML = "<strong>⚠️ CVV is required.</strong>";
          cvvError.style.color = "red";
          return false;
      } else if (!isValid) {
          cvvError.innerHTML = "<strong>❌ Enter a valid 3-digit CVV.</strong>";
          cvvError.style.color = "red";
          return false;
      } else {
          cvvError.innerHTML = "<strong>✅ Looks good!</strong>";
          cvvError.style.color = "green";
          return true;
      }
  }

  function validateCardholderName(name) {
      // Allow letters, spaces, and hyphens only
      const isValid = /^[A-Za-z\s-]+$/.test(name);
      
      if (name === '') {
          cardholderNameError.innerHTML = "<strong>⚠️ Cardholder name is required.</strong>";
          cardholderNameError.style.color = "red";
          return false;
      } else if (!isValid) {
          cardholderNameError.innerHTML = "<strong>❌ Enter a valid name (letters only).</strong>";
          cardholderNameError.style.color = "red";
          return false;
      } else if (name.length < 3) {
          cardholderNameError.innerHTML = "<strong>❌ Name is too short.</strong>";
          cardholderNameError.style.color = "red";
          return false;
      } else {
          cardholderNameError.innerHTML = "<strong>✅ Looks good!</strong>";
          cardholderNameError.style.color = "green";
          return true;
      }
  }

  // ✅ Store Transaction Details
  function storeTransactionDetails(paymentMode) {
      let currentPlan = JSON.parse(sessionStorage.getItem("currentPlan"));
      let currentCustomer = JSON.parse(sessionStorage.getItem("currentCustomer"));

      if (!currentCustomer || !currentCustomer.userId) {
          console.error("No current customer found.");
          return;
      }

      let userId = currentCustomer.userId;
      let userMobile = currentCustomer.mobile;

      let now = new Date();
      let purchaseDate = now.toISOString();
      let startDate = now.toISOString();

      let endDate = new Date();
      endDate.setDate(now.getDate() + currentPlan.validity);
      let planEndDate = endDate.toISOString();

      // Generate transaction ID
      let transactionId = "TXN" + Math.floor(100000000000 + Math.random() * 900000000000).toString();

      let transactionDetails = {
          amount: currentPlan.price,
          transactionStatus: "SUCCESSFUL",
          planStatus: "ACTIVE",
          purchasedOn: purchaseDate,
          paymentMode: paymentMode,
          refNumber: transactionId,
          planStart: startDate,
          planEnd: planEndDate,
          user: {
              userId: userId
          },
          plan: {
              planId: currentPlan.planId
          }
      };

      // Send transaction details to backend
      fetch("http://localhost:8083/api/transactions", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionDetails),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log("Transaction stored successfully:", data);
          // Store transaction in sessionStorage
          sessionStorage.setItem("currentTransaction", JSON.stringify(transactionDetails));
      })
      .catch((error) => {
          console.error("Error storing transaction:", error);
      });
  }
  
  // ✅ Set payment amounts from current plan
  function setPaymentAmounts() {
      let currentPlan = JSON.parse(sessionStorage.getItem("currentPlan"));
      if (currentPlan && currentPlan.price) {
          let upiAmount = document.getElementById("upiPayAmount");
          let cardAmount = document.getElementById("cardPayAmount");
          
          if (upiAmount) upiAmount.textContent = currentPlan.price;
          if (cardAmount) cardAmount.textContent = currentPlan.price;
      }
  }
  
  // Call to set payment amounts when page loads
  setPaymentAmounts();
});








function goBack() {
  window.location.href = "/Mobile_Prepaid_Customer/Prepaid_plans_Page/Popular_plans/prepaid.html";
}
