// payment.js - Enhanced with better data handling and UI improvements
document.addEventListener("DOMContentLoaded", function () {
  // Get data from session storage
  const currentPlan = JSON.parse(sessionStorage.getItem("currentPlan") || "{}");
  const currentCustomer = JSON.parse(sessionStorage.getItem("currentCustomer") || "{}");
  
  // Populate FAB amount if it exists
  const fabAmountElement = document.getElementById("fabAmount");
  if (fabAmountElement && currentPlan && currentPlan.price) {
    fabAmountElement.textContent = parseFloat(currentPlan.price).toFixed(2);
  }
  
  // Load user details with enhanced information
  function loadUserDetails() {
    if (currentCustomer) {
      // Basic user information
      document.getElementById("userName").textContent = currentCustomer.name || "Not available";
      document.getElementById("userMobile").textContent = currentCustomer.mobile || currentCustomer.mobileNumber || "Not available";
      document.getElementById("userEmail").textContent = currentCustomer.email || "Not available";
      document.getElementById("userId").textContent = currentCustomer.userId || "Not available";
      
      // Additional information if available in currentCustomer
      if (document.getElementById("userAddress") && currentCustomer.address) {
        document.getElementById("userAddress").textContent = currentCustomer.address;
      }
      
      if (document.getElementById("userCity") && currentCustomer.city) {
        document.getElementById("userCity").textContent = currentCustomer.city;
      }
      
      if (document.getElementById("userState") && currentCustomer.state) {
        document.getElementById("userState").textContent = currentCustomer.state;
      }
      
      if (document.getElementById("userPincode") && currentCustomer.pincode) {
        document.getElementById("userPincode").textContent = currentCustomer.pincode;
      }
      
      if (document.getElementById("userPlan") && currentCustomer.currentPlan) {
        document.getElementById("userPlan").textContent = currentCustomer.currentPlan;
      }
      
      if (document.getElementById("userBalance") && currentCustomer.balance) {
        document.getElementById("userBalance").textContent = "₹" + currentCustomer.balance;
      }
      
      if (document.getElementById("userJoinDate") && currentCustomer.joinDate) {
        document.getElementById("userJoinDate").textContent = new Date(currentCustomer.joinDate).toLocaleDateString();
      }
    } else {
      // Set defaults if no customer data is available
      document.getElementById("userName").textContent = "Not available";
      document.getElementById("userMobile").textContent = "Not available";
      document.getElementById("userEmail").textContent = "Not available";
      document.getElementById("userId").textContent = "Not available";
    }
  }
  
  // Load plan details
  function loadPlanDetails() {
    if (currentPlan) {
      // Basic plan details
      document.getElementById("planName").textContent = currentPlan.planName || "Standard Plan";
      document.getElementById("planId").textContent = currentPlan.planId || "N/A";
      document.getElementById("planValidity").textContent = currentPlan.validity || "0";
      
      // Data details
      document.getElementById("planData").textContent = currentPlan.dailyData || "Not specified";
      document.getElementById("totalData").textContent = currentPlan.totalData || "Not specified";
      document.getElementById("planVoice").textContent = currentPlan.voice || "Not specified";
      document.getElementById("planSMS").textContent = currentPlan.sms || "Not specified";
      
      // Category
      document.getElementById("planCategory").textContent = 
        currentPlan.category || 
        (currentPlan.categories && currentPlan.categories.length > 0 ? 
          currentPlan.categories[0].categoryName : "General Plan");
      
      // Display plan price without GST calculation
      const planPrice = parseFloat(currentPlan.price) || 0;
      
      document.getElementById("planAmount").textContent = planPrice.toFixed(2);
      document.getElementById("totalAmount").textContent = planPrice.toFixed(2);
      document.getElementById("payButtonAmount").textContent = planPrice.toFixed(2);
      
      // Handle OTT benefits if available
      if (currentPlan.ott && currentPlan.ott.length > 0) {
        const ottBadgesContainer = document.getElementById("ottBadges");
        ottBadgesContainer.innerHTML = ''; // Clear container
        
        // Filter out duplicate OTT services
        const uniqueOttServices = [...new Set(currentPlan.ott)];
        
        uniqueOttServices.forEach(ottService => {
          const badge = document.createElement("span");
          badge.className = "ott-badge";
          
          // Select icon based on OTT service name
          let iconClass = "fa-tv";
          if (ottService.toLowerCase().includes("netflix")) {
            iconClass = "fa-film";
          } else if (ottService.toLowerCase().includes("prime")) {
            iconClass = "fa-shipping-fast";
          } else if (ottService.toLowerCase().includes("hotstar") || ottService.toLowerCase().includes("disney")) {
            iconClass = "fa-star";
          } else if (ottService.toLowerCase().includes("sony")) {
            iconClass = "fa-play-circle";
          } else if (ottService.toLowerCase().includes("zee")) {
            iconClass = "fa-video";
          }
          
          badge.innerHTML = `<i class="fas ${iconClass}"></i> ${ottService}`;
          ottBadgesContainer.appendChild(badge);
        });
      } else {
        // Hide OTT section if no OTT benefits
        const ottContainer = document.getElementById("ottContainer");
        if (ottContainer) {
          ottContainer.style.display = "none";
        }
      }
      
      // Load terms and conditions dynamically
      loadTermsAndConditions();
    } else {
      // Set defaults if no plan data is available
      document.getElementById("planName").textContent = "Plan Not Selected";
      document.getElementById("planId").textContent = "N/A";
      document.getElementById("planValidity").textContent = "0";
      document.getElementById("planData").textContent = "Not specified";
      document.getElementById("totalData").textContent = "Not specified";
      document.getElementById("planVoice").textContent = "Not specified";
      document.getElementById("planSMS").textContent = "Not specified";
      document.getElementById("planCategory").textContent = "General Plan";
      document.getElementById("planAmount").textContent = "0.00";
      document.getElementById("totalAmount").textContent = "0.00";
      document.getElementById("payButtonAmount").textContent = "0.00";
    }
  }
  
  // Load terms and conditions dynamically
  function loadTermsAndConditions() {
    const termsContainer = document.getElementById("termsList");
    const termsSection = document.getElementById("termsSection");
    
    if (termsContainer) {
      termsContainer.innerHTML = ''; // Clear existing content
      
      // Check if we have terms in the current plan
      if (currentPlan && currentPlan.terms && Array.isArray(currentPlan.terms) && currentPlan.terms.length > 0) {
        // Add each term as a list item
        currentPlan.terms.forEach(term => {
          const li = document.createElement("li");
          li.textContent = term;
          termsContainer.appendChild(li);
        });
      } else if (currentPlan && typeof currentPlan.terms === 'string' && currentPlan.terms.trim() !== '') {
        // If terms is a single string, split by line breaks or numbers
        const termsText = currentPlan.terms;
        const termsList = termsText.split(/\r?\n|\d+\.\s+/).filter(term => term.trim() !== '');
        
        termsList.forEach(term => {
          const li = document.createElement("li");
          li.textContent = term.trim();
          termsContainer.appendChild(li);
        });
      } else {
        // Default terms if none provided
        const defaultTerms = [
          "Post daily 100 SMS limit, charges will apply: ₹1 per Local SMS | ₹1.5 per STD SMS.",
          "Data usage beyond daily limit will be charged at ₹0.50/MB or reduced to 64Kbps speed.",
          "Unlimited voice calls are included with no additional charges.",
          "Once purchased, this plan cannot be cancelled or refunded.",
          "This plan will be active immediately after successful payment."
        ];
        
        defaultTerms.forEach(term => {
          const li = document.createElement("li");
          li.textContent = term;
          termsContainer.appendChild(li);
        });
      }
    }
    
    // Hide the entire terms section if no terms are available
    if (termsSection && (!currentPlan || !currentPlan.terms)) {
      // Uncomment the next line if you want to completely hide the terms section when no terms exist
      // termsSection.style.display = "none";
    }
  }
  
  // Calculate and display plan dates
  function calculatePlanDates() {
    if (currentPlan && currentPlan.validity) {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + parseInt(currentPlan.validity));
      
      // Format dates in a more readable format
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      document.getElementById("planStartDate").textContent = now.toLocaleDateString('en-IN', options);
      document.getElementById("planEndDate").textContent = endDate.toLocaleDateString('en-IN', options);
    } else {
      document.getElementById("planStartDate").textContent = "On payment completion";
      document.getElementById("planEndDate").textContent = "On payment completion";
    }
  }
  
  // Show notification
  function showNotification(message, type = "info") {
    const notificationEl = document.createElement("div");
    notificationEl.className = `notification ${type}`;
    notificationEl.style.position = "fixed";
    notificationEl.style.top = "20px";
    notificationEl.style.right = "20px";
    notificationEl.style.padding = "15px 20px";
    notificationEl.style.borderRadius = "5px";
    notificationEl.style.backgroundColor = type === 'success' ? "#4CAF50" : 
                                          type === 'error' ? "#F44336" : 
                                          type === 'warning' ? "#FFC107" : "#2196F3";
    notificationEl.style.color = "#fff";
    notificationEl.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    notificationEl.style.zIndex = "1000";
    notificationEl.style.transform = "translateY(-20px)";
    notificationEl.style.opacity = "0";
    notificationEl.style.transition = "all 0.3s ease";
    
    notificationEl.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}" 
         style="margin-right: 10px;"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notificationEl);
    
    // Animate in
    setTimeout(() => {
      notificationEl.style.transform = "translateY(0)";
      notificationEl.style.opacity = "1";
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notificationEl.style.transform = "translateY(-20px)";
      notificationEl.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(notificationEl);
      }, 300);
    }, 5000);
  }
  
  // Show error notification
  function showErrorNotification(message) {
    showNotification(message, "error");
  }
  
  // Initialize Razorpay Order
  async function initializeRazorpayOrder() {
    try {
      if (!currentCustomer || !currentCustomer.userId || !currentPlan || !currentPlan.planId) {
        console.error("Missing customer or plan details", { customer: currentCustomer, plan: currentPlan });
        showErrorNotification("Unable to process payment. Missing customer or plan details.");
        return;
      }
      
      // Show loading state on button
      const payButton = document.getElementById("quickPayButton");
      const originalButtonText = payButton.innerHTML;
      payButton.innerHTML = '<div class="loading"></div> Processing...';
      payButton.disabled = true;
      
      const paymentRequest = {
        userId: currentCustomer.userId,
        planId: currentPlan.planId,
        currency: "INR",
        mobile: currentCustomer.mobile || currentCustomer.mobileNumber,
        paymentMode: "all" // Default to all payment methods
      };
      
      console.log("Sending payment request:", paymentRequest);
      
      // Create Razorpay order via backend
      const response = await fetch("http://localhost:8083/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to create order: " + errorText);
      }
      
      const responseData = await response.json();
      console.log("Order created successfully:", responseData);
      
      openRazorpayCheckout(responseData);
      
    } catch (error) {
      console.error("Error initializing payment:", error);
      showErrorNotification("Payment initialization failed: " + error.message);
      
      // Reset button state
      const payButton = document.getElementById("quickPayButton");
      payButton.innerHTML = originalButtonText;
      payButton.disabled = false;
    }
  }
  
  // Open Razorpay Checkout
  function openRazorpayCheckout(orderData) {
    const options = {
      key: orderData.keyId || "rzp_test_yourkeyhere", // Fallback to test key
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Mobile Prepaid",
      description: `${currentPlan.planName || 'Plan'} Recharge`,
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: currentCustomer.name || "",
        email: currentCustomer.email || "",
        contact: currentCustomer.mobile || currentCustomer.mobileNumber || ""
      },
      notes: {
        planId: currentPlan.planId,
        userId: currentCustomer.userId
      },
      theme: {
        color: "#ff4500"
      },
      modal: {
        ondismiss: function() {
          console.log("Payment cancelled by user");
          showNotification("Payment cancelled", "warning");
          
          // Reset button state
          const payButton = document.getElementById("quickPayButton");
          payButton.innerHTML = `<i class="fas fa-bolt"></i> Quick Pay ₹${currentPlan.price || "0"}`;
          payButton.disabled = false;
        }
      },
      handler: function(response) {
        handlePaymentSuccess(response, orderData.razorpayOrderId);
      }
    };
    
    console.log("Opening Razorpay with options:", {
      ...options,
      key: "HIDDEN_FOR_SECURITY" // Don't log the key
    });
    
    const razorpayCheckout = new Razorpay(options);
    razorpayCheckout.open();
  }
  
  // Handle Payment Success
  // In payment.js, modify handlePaymentSuccess function
async function handlePaymentSuccess(response, orderId) {
  try {
      console.log("Payment success response:", response);
      
      // Show loading state
      const payButton = document.getElementById("quickPayButton");
      payButton.innerHTML = '<div class="loading"></div> Verifying Payment...';
      
      // Verify payment with backend
      const verificationData = {
          razorpayOrderId: orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          userId: currentCustomer.userId,
          planId: currentPlan.planId,
          paymentMode: "all" // Use default payment mode
      };
      
      console.log("Sending verification data:", verificationData);
      
      const verificationResponse = await fetch("http://localhost:8083/api/payment/verify-payment", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(verificationData),
      });
      
      if (!verificationResponse.ok) {
          const errorText = await verificationResponse.text();
          console.error("Payment verification failed:", errorText);
          throw new Error("Payment verification failed: " + errorText);
      }
      
      const result = await verificationResponse.json();
      console.log("Verification result:", result);
      
      if (result.status === "success") {
          // Store transaction in sessionStorage for the success page
          sessionStorage.setItem("currentTransaction", JSON.stringify(result.transaction));
          
          // Show success state on button before redirecting
          payButton.innerHTML = '<i class="fas fa-check-circle"></i> Payment Successful!';
          payButton.style.backgroundColor = "var(--green)";
          
          let successMessage = "Payment Successful! Redirecting to success page...";
          
          // Add email confirmation info if available
          if (result.hasOwnProperty('emailSent')) {
              if (result.emailSent) {
                  successMessage += " A confirmation email has been sent to your email address.";
              }
          }
          
          showNotification(successMessage, "success");
          
          // Redirect to success page after a short delay
          setTimeout(() => {
              window.location.href = "/Mobile_Prepaid_Customer/Payment-Status_Page/Payment-Success_Page/payment_success.html";
          }, 2000);
      } else {
          throw new Error(result.message || "Payment verification failed");
      }
  } catch (error) {
      console.error("Error processing payment:", error);
      showErrorNotification("Payment failed: " + error.message);
      
      // Reset button state
      const payButton = document.getElementById("quickPayButton");
      payButton.innerHTML = `<i class="fas fa-bolt"></i> Quick Pay ₹${currentPlan.price || "0"}`;
      payButton.disabled = false;
  }
}
  
  // Handle FAB click for mobile
  function setupOrderSummaryFab() {
    const fab = document.getElementById("orderSummaryFab");
    if (fab) {
      fab.addEventListener("click", function() {
        // Scroll to payment section
        const paymentSection = document.querySelector('.payment-info');
        if (paymentSection) {
          paymentSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
  
  // Process terms from data
  function processTermsFromText(termsText) {
    if (!termsText) return [];
    
    // Split by newlines or numbered items (1., 2., etc.)
    return termsText
      .split(/\r?\n|\d+\.\s+/)
      .map(term => term.trim())
      .filter(term => term !== '');
  }
  
  // Add event listener for the quick pay button
  const quickPayButton = document.getElementById("quickPayButton");
  if (quickPayButton) {
    quickPayButton.addEventListener("click", function() {
      initializeRazorpayOrder();
    });
  }
  
  // Initialize the page
  loadUserDetails();
  loadPlanDetails();
  calculatePlanDates();
  setupOrderSummaryFab();
  
  // Log initial state
  console.log("Page initialized with plan:", currentPlan);
  console.log("Page initialized with customer:", currentCustomer);
});