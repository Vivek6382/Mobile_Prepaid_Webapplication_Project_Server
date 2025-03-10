function toggleAccordion(header) {
    let content = header.nextElementSibling;
    let icon = header.querySelector('.accordion-icon');

    if (content.style.display === "block") {
        content.style.display = "none";
        icon.textContent = "+";
    } else {
        content.style.display = "block";
        icon.textContent = "-";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const radioButtons = document.querySelectorAll("input[type='radio']");

    radioButtons.forEach(radio => {
        radio.addEventListener("change", function () {
            if (this.checked) {
                if (this.value === "googlepay") {
                    window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/upi_pop-up_Design/upi_pop-up.html";
                } else if (this.value === "phonepe") {
                    window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/upi_pop-up_Design/upi_pop-up.html";
                } else if (this.value === "paytm") {
                    window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/upi_pop-up_Design/upi_pop-up.html";
                } else if (this.value === "card payment") {
                    window.location.href = "/Mobile_Prepaid_Customer/Payment_Page/card-pop-up_Design/card-pop-up.html";
                }
            }
        });
    });
});
