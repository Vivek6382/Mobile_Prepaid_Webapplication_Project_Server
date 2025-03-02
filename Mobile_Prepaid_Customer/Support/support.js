document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.nextElementSibling;
        const icon = item.querySelector('.faq-icon');

        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
            icon.textContent = "+";
        } else {
            document.querySelectorAll('.faq-answer').forEach(ans => ans.style.maxHeight = null);
            document.querySelectorAll('.faq-icon').forEach(ic => ic.textContent = "+");

            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.textContent = "-";
        }
    });
});




// Nav-Drop-Down


  // Profile-DropDown-JS

  document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.querySelector(".user-dropdown");
    const dropdownContent = document.querySelector(".dropdown-content");
    const userIcon = document.getElementById("userIcon"); // User icon
    const signOutBtn = document.getElementById("signOutBtn"); // Sign-out button

    function updateDropdown() {
        const currentCustomer = sessionStorage.getItem("currentCustomer");

        if (currentCustomer) {
            // Show dropdown when user icon is clicked
            userIcon.onclick = function (event) {
                event.stopPropagation();
                dropdownContent.classList.toggle("active");
            };

            // Ensure dropdown is visible
            dropdownContent.style.display = "block";

            // Sign-out functionality
            signOutBtn.onclick = function (event) {
                event.preventDefault();
                sessionStorage.removeItem("currentCustomer"); // Remove session storage

                // Ensure the storage is cleared before redirecting
                setTimeout(() => {
                    window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html"; 
                }, 100);
            };
        } else {
            // If not logged in, clicking the user icon redirects to the recharge page
            userIcon.onclick = function () {
                window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
            };

            // Ensure dropdown is hidden
            dropdownContent.style.display = "none";
        }
    }

    // Initialize dropdown behavior
    updateDropdown();

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!userDropdown.contains(event.target)) {
            dropdownContent.classList.remove("active");
        }
    });

    // Handle case where user manually navigates away after signing out
    window.addEventListener("storage", function () {
        if (!sessionStorage.getItem("currentCustomer")) {
            window.location.href = "/Mobile_Prepaid_Customer/Recharge_Page/recharge.html";
        }
    });

    // Listen for login event from the recharge form
    window.addEventListener("storage", function () {
        if (sessionStorage.getItem("currentCustomer")) {
            updateDropdown(); // Update dropdown dynamically after login
        }
    });

});






  document.addEventListener("DOMContentLoaded", function () {
    const viewMoreBtn = document.querySelector(".view-more-btn");
    const hiddenVideos = document.querySelectorAll(".video-card.hidden");
    const videoContainer = document.querySelector(".video-container");
    let isExpanded = false;

    viewMoreBtn.addEventListener("click", function () {
        if (!isExpanded) {
            hiddenVideos.forEach(video => video.style.display = "block");
            videoContainer.style.maxHeight = "none"; // Expand container height
            viewMoreBtn.textContent = "Show Less";
            isExpanded = true;
        } else {
            hiddenVideos.forEach(video => video.style.display = "none");
            videoContainer.style.maxHeight = "250px"; // Collapse container height
            viewMoreBtn.textContent = "View More Tutorials";
            isExpanded = false;
        }
    });
});


