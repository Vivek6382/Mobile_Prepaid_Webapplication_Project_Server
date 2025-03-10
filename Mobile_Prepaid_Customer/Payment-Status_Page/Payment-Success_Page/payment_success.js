document.addEventListener("DOMContentLoaded", function () {
    // Fetch transaction data from session storage
    const currentTransaction = JSON.parse(sessionStorage.getItem("currentTransaction")) || {};
    const planDetails = currentTransaction.plan_details || {};

    // Set transaction details
    document.getElementById("amount").innerText = `₹${currentTransaction.amount || "N/A"}`;
    document.getElementById("payment-mode").innerText = currentTransaction.payment_mode || "N/A";
    document.getElementById("transaction-id").innerText = `#${currentTransaction.ref_number || "N/A"}`;
    document.getElementById("purchase-date").innerText = currentTransaction.purchased_on || "N/A";
    document.getElementById("plan-start").innerText = currentTransaction.plan_start || "N/A";
    document.getElementById("plan-end").innerText = currentTransaction.plan_end || "N/A";

    // Set plan details
    document.getElementById("plan-name").innerText = planDetails.planName || "N/A";
    document.getElementById("plan-price").innerText = planDetails.price || "N/A";
    document.getElementById("plan-validity").innerText = planDetails.validity || "N/A";
    document.getElementById("plan-total-data").innerText = planDetails.totalData || "N/A";

    // Handle optional fields
    if (planDetails.dailyData) {
        document.getElementById("plan-daily-data").innerText = planDetails.dailyData;
    } else {
        document.getElementById("daily-data-container").style.display = "none";
    }

    if (planDetails.voice) {
        document.getElementById("plan-calls").innerText = planDetails.voice;
    } else {
        document.getElementById("voice-container").style.display = "none";
    }

    if (planDetails.sms) {
        document.getElementById("plan-sms").innerText = planDetails.sms;
    } else {
        document.getElementById("sms-container").style.display = "none";
    }

    // Set OTT benefits dynamically
    const ottSection = document.getElementById("ott-section");
    if (planDetails.ott && planDetails.ott.length > 0) {
        const availableOTTs = ["Netflix", "Amazon Prime", "Sony LIV", "Sun NXT", "Zee5"];
        const ottList = planDetails.ott.filter(ott => availableOTTs.includes(ott));

        if (ottList.length > 0) {
            document.getElementById("ott-list").innerHTML = ottList.map(ott => `<div class="ott">${ott}</div>`).join("");
            ottSection.style.display = "block";
        }
    }

    // Set Terms & Conditions dynamically
    const termsSection = document.getElementById("terms-section");
    if (planDetails.terms && planDetails.terms.length > 0) {
        document.getElementById("terms-list").innerHTML = planDetails.terms.map(term => `<div class="term">${term}</div>`).join("");
        termsSection.style.display = "block";
    }

    // Invoice Download Button
    document.getElementById("downloadInvoice").addEventListener("click", function() {
        alert("Downloading Invoice...");
        // Add actual PDF generation & download logic here
    });
});
