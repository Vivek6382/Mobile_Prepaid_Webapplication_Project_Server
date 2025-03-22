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
            generateInvoice(latestTransaction, planDetails);
        });
    } catch (error) {
        console.error("Error fetching transaction data:", error.message);
    }
  });
  
  function generateInvoice(transaction, planDetails) {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        // If jsPDF isn't loaded, load it dynamically
        loadJsPDF(() => {
            generatePDF(transaction, planDetails);
        });
    } else {
        // If jsPDF is already loaded, generate PDF directly
        generatePDF(transaction, planDetails);
    }
  }
  
  function loadJsPDF(callback) {
    let scriptsLoaded = 0;
    const totalScripts = 2;
    
    // Create script element for jsPDF
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function() {
        scriptsLoaded++;
        if (scriptsLoaded === totalScripts) {
            callback();
        }
    };
    document.head.appendChild(script);
    
    // AutoTable plugin
    const autoTableScript = document.createElement('script');
    autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js';
    autoTableScript.onload = function() {
        scriptsLoaded++;
        if (scriptsLoaded === totalScripts) {
            callback();
        }
    };
    document.head.appendChild(autoTableScript);
  }
  
  function generatePDF(transaction, planDetails) {
    try {
        // Make sure jsPDF is loaded
        if (typeof window.jspdf === 'undefined') {
            console.error("jsPDF library not loaded");
            alert("Could not generate PDF. Please try again later.");
            return;
        }
  
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
  
        // Extract transaction details
        const planAmount = transaction.amount || "N/A";
        const paymentMode = transaction.paymentMode || "N/A";
        const refNumber = transaction.refNumber || "N/A";
        const transactionDate = new Date(transaction.purchasedOn).toLocaleDateString() || "N/A";
        const planStartDate = new Date(transaction.planStart).toLocaleDateString() || "N/A";
        const planEndDate = new Date(transaction.planEnd).toLocaleDateString() || "N/A";
        const transactionStatus = "Success"; // Assuming success since it's payment success page
  
        // Get plan details
        const planName = planDetails.planName || "Mobi-Comm Plan";
        const planValidity = planDetails.validity || "N/A";
        const planTotalData = planDetails.totalData || "N/A";
        const planDailyData = planDetails.dailyData || "N/A";
        const planCalls = planDetails.voice || "N/A";
        const planSms = planDetails.sms || "N/A";
  
        // Try to fetch user details from the page - if not available, use placeholders
        const userName = document.querySelector(".user-name")?.textContent.trim() || "Customer";
        const userMobile = document.querySelector(".user-mobile")?.textContent.trim() || transaction.mobileNumber || "N/A";
        const userEmail = document.querySelector(".fa-envelope + span")?.textContent.trim() || transaction.email || "N/A";
  
        // Invoice details
        const invoiceNo = "INV" + Math.floor(Math.random() * 1000000);
        const companyName = "Mobi-Comm Services";
        const companyAddress = "123, Tech Street, City, India - 600001";
        const rupeeSymbol = "₹"; // ₹ symbol
        const formattedPlanAmount = rupeeSymbol + " " + planAmount; // Ensure ₹ is explicitly added
  
        // Add a border for the page
        doc.setDrawColor(0);
        doc.rect(5, 5, 200, 287); // Border rectangle
  
        // Set up header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(companyName, 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(companyAddress, 105, 30, { align: "center" });
        doc.line(20, 35, 190, 35); // Horizontal line
  
        // Invoice title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 105, 45, { align: "center" });
        doc.line(20, 50, 190, 50); // Horizontal line
  
        let startY = 60;
  
        // Table Formatting
        const tableOptions = {
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] }, // Black text color
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }, // Light gray background, black text
            columnStyles: { 0: { fontStyle: "bold", halign: "left" }, 1: { halign: "left" } }
        };
  
        // Invoice and transaction details table
        doc.autoTable({
            startY: startY,
            head: [["Invoice Details", ""]],
            body: [
                ["Invoice No:", invoiceNo],
                ["Transaction Date:", transactionDate],
                ["Status:", transactionStatus],
                ["Plan Start Date:", planStartDate],
                ["Plan End Date:", planEndDate]
            ],
            ...tableOptions
        });
  
        startY = doc.lastAutoTable.finalY + 10; // Move below the previous table
  
        // Customer details table
        doc.autoTable({
            startY: startY,
            head: [["Customer Details", ""]],
            body: [
                ["Name", userName],
                ["Mobile", userMobile],
                ["Email", userEmail]
            ],
            ...tableOptions
        });
  
        startY = doc.lastAutoTable.finalY + 10;
  
        // Payment details table
        doc.autoTable({
            startY: startY,
            head: [["Payment Details", ""]],
            body: [
                ["Payment Mode", paymentMode],
                ["Reference No", refNumber]
            ],
            ...tableOptions
        });
  
        startY = doc.lastAutoTable.finalY + 10;
  
        // Prepare plan details rows
        const planDetailsRows = [
            ["Plan Name", planName],
            ["Amount", formattedPlanAmount],
            ["Duration", planValidity],
            ["Total Data", planTotalData]
        ];
  
        // Add optional plan details if available
        if (planDailyData !== "N/A") {
            planDetailsRows.push(["Data at High Speed", planDailyData]);
        }
        if (planCalls !== "N/A") {
            planDetailsRows.push(["Voice", planCalls]);
        }
        if (planSms !== "N/A") {
            planDetailsRows.push(["SMS", planSms]);
        }
  
        // Add OTT benefits if available
        if (planDetails.ott && planDetails.ott.length > 0) {
            planDetailsRows.push(["OTT Benefits", planDetails.ott.join(", ")]);
        }
  
        // Plan details table
        doc.autoTable({
            startY: startY,
            head: [["Plan Details", ""]],
            body: planDetailsRows,
            ...tableOptions
        });
  
        startY = doc.lastAutoTable.finalY + 8; // Adjust spacing
  
        // Total amount section (aligned to the right)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`Total Amount: ${rupeeSymbol} ${planAmount}`, 180, startY, { align: "right" });
  
        // Footer (Ensure correct spacing)
        startY += 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for choosing Mobi-Comm Services!", 105, startY, { align: "center" });
  
        // Save the PDF
        doc.save(invoiceNo + ".pdf");
        
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate invoice. Please try again later.");
    }
  }