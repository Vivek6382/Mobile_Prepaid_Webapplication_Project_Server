let time = 30;
const timerElement = document.getElementById('timer');
const resendLink = document.getElementById('resendLink');
const otpInputs = document.querySelectorAll('.otp-input');

function startTimer() {
    const countdown = setInterval(() => {
        time--;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (time <= 0) {
            clearInterval(countdown);
            timerElement.style.visibility = 'hidden'; // Make timer invisible
        }
    }, 1000);
}

startTimer();


// Back button functionality
document.querySelector('.back-btn').addEventListener('click', () => {
    window.history.back();
});


// OTP input handling (auto-focus next input)
otpInputs.forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});


// Resend link functionality
resendLink.addEventListener('click', () => {
    otpInputs.forEach(input => input.value = ''); // Clear OTP inputs
    time = 30; // Reset timer
    timerElement.style.visibility = 'visible'; // Show timer again
    startTimer(); // Start the timer again
});



//OTP - Validation 

// OTP Validation Script
document.addEventListener("DOMContentLoaded", function () {
    const otpInputs = document.querySelectorAll(".otp-input");
    const otpForm = document.getElementById("otp-form");

    // Handling Input Movement
    otpInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const value = e.target.value;
            if (value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus(); // Move to next input
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !e.target.value && index > 0) {
                otpInputs[index - 1].focus(); // Move to previous input
            }
        });
    });

    // OTP Form Validation
    otpForm.addEventListener("submit", function (event) {
        let otpValue = "";
        otpInputs.forEach((input) => {
            otpValue += input.value;
        });

        // Ensure all 6 digits are entered
        if (otpValue.length !== 6) {
            event.preventDefault();
            alert("Please enter all 6 digits of the OTP.");
        }
    });
});
