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

document.addEventListener("DOMContentLoaded", function () {
  const accordionHeaders = document.querySelectorAll(".accordion-header");
  const upiOptions = document.querySelectorAll("input[name='upi']");
  const closeButton = document.querySelector(".close-link");
  const upiInput = document.getElementById("upi-id");
  const upiButtons = document.querySelectorAll(".upi-option");
  const upiError = document.getElementById("upiError");
  const upiForm = document.getElementById("upiForm");

  // ✅ UPI ID regex pattern
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

      if (upiInput) {
          upiInput.value = "";
          upiInput.placeholder = "Enter UPI ID";
          upiError.innerHTML = "";
      }
  }

  function closeUpiPopup() {
      let overlay = document.getElementById("upiOverlay");
      if (overlay) overlay.classList.remove("active");

      if (upiInput) {
          upiInput.value = "";
          upiError.innerHTML = "";
      }

      document.querySelectorAll("input[name='upi']").forEach((radio) => {
          radio.checked = false;
      });
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

  upiOptions.forEach((option) => {
      option.addEventListener("click", function () {
          if (this.checked) showUpiPopup(this.value);
      });
  });

  if (closeButton) {
      closeButton.addEventListener("click", closeUpiPopup);
  }

  upiButtons.forEach((button) => {
      button.addEventListener("click", function () {
          appendUpi(this.textContent.trim());
      });
  });

  // ✅ UPI ID Validation on Form Submission
  upiForm.addEventListener("submit", function (event) {
      let upiValue = upiInput.value.trim();

      if (!validateUpiForm(upiValue)) {
          event.preventDefault();
          return;
      }

      // ✅ Proceed with storing transaction details if form is valid
      storeTransactionDetails("UPI");
  });

  // ✅ Validation on Input (Error Appears as User Types)
  upiInput.addEventListener("input", function () {
      validateUpiForm(upiInput.value.trim());
  });

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

  // ✅ Store Transaction Details (UPI or Card) in the backend
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
      let purchaseDate = now.toISOString(); // Corrected format for timestamp

      let startDate = now.toISOString(); // Corrected format for start date

      let endDate = new Date();
      endDate.setDate(now.getDate() + currentPlan.validity);
      let planEndDate = endDate.toISOString(); // Corrected format for end date

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

      // ✅ Send the transaction details to the backend using Fetch API
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
          // ✅ Store the latest transaction in sessionStorage for pop-up display
          sessionStorage.setItem("currentTransaction", JSON.stringify(transactionDetails));
      })
      .catch((error) => {
          console.error("Error storing transaction:", error);
      });
  }
});
