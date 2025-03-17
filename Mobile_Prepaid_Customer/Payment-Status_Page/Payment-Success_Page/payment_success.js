document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch all transactions and get the latest one
        const response = await fetch("http://localhost:8083/api/transactions");
        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }
        
        const transactions = await response.json();
        if (!transactions.length) {
            throw new Error("No transactions found");
        }

        // Get the latest transaction (assuming the last one is the latest)
        const latestTransaction = transactions[transactions.length - 1];
        const planDetails = latestTransaction.plan || {};

        // Set transaction details
        document.getElementById("amount").innerText = `₹${latestTransaction.amount || "N/A"}`;
        document.getElementById("payment-mode").innerText = latestTransaction.paymentMode || "N/A";
        document.getElementById("transaction-id").innerText = `#${latestTransaction.refNumber || "N/A"}`;
        document.getElementById("purchase-date").innerText = new Date(latestTransaction.purchasedOn).toLocaleDateString() || "N/A";
        document.getElementById("plan-start").innerText = new Date(latestTransaction.planStart).toLocaleDateString() || "N/A";
        document.getElementById("plan-end").innerText = new Date(latestTransaction.planEnd).toLocaleDateString() || "N/A";

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
            document.getElementById("ott-list").innerHTML = planDetails.ott.map(ott => `<div class="ott">${ott}</div>`).join(" ");
            ottSection.style.display = "block";
        }

        // Set Terms & Conditions dynamically
        const termsSection = document.getElementById("terms-section");
        if (planDetails.terms && planDetails.terms.length > 0) {
            document.getElementById("terms-list").innerHTML = planDetails.terms.map(term => `<div class="term">${term}</div>`).join(" ");
            termsSection.style.display = "block";
        }

        // Invoice Download Button
        document.getElementById("downloadInvoice").addEventListener("click", function() {
            alert("Downloading Invoice...");
            // Add actual PDF generation & download logic here
        });
    } catch (error) {
        console.error("Error fetching transaction data:", error.message);
    }
});
