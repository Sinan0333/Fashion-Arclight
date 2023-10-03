// verification page input 
document.addEventListener("DOMContentLoaded", function(event) {
            function OTPInput() {
                const inputs = document.querySelectorAll('#otp > *[id]');
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].addEventListener('keydown', function(event) {
                        if (event.key === "Backspace") {
                            inputs[i].value = '';
                            if (i !== 0) inputs[i - 1].focus();
                        } else {
                            if (i === inputs.length - 1 && inputs[i].value !== '') {
                                return true;
                            } else if (event.keyCode > 47 && event.keyCode < 58) {
                                inputs[i].value = event.key;
                                if (i !== inputs.length - 1) inputs[i + 1].focus();
                                event.preventDefault();
                            } else if (event.keyCode > 64 && event.keyCode < 91) {
                                inputs[i].value = String.fromCharCode(event.keyCode);
                                if (i !== inputs.length - 1) inputs[i + 1].focus();
                                event.preventDefault();
                            }
                        }
                    });
                }
            }
            OTPInput();
          });



// resend button and countdown
document.addEventListener("DOMContentLoaded", function () {
    const resendButton = document.getElementById("resend");
    const countdownDisplay = document.getElementById("countdown");
    
    let countdownTime = 60;
    
    function updateTimerDisplay() {
        countdownDisplay.textContent = countdownTime; 
    }
    
    function startCountdown() {
        resendButton.disabled = true;
        updateTimerDisplay();
        
        const countdownInterval = setInterval(function () {
            countdownTime--;
            updateTimerDisplay();
            
            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                resendButton.disabled = false;
                countdownDisplay.textContent = "";
            }
        }, 1000);
    }
    
    resendButton.addEventListener("click", function () {
        countdownTime = 60;
        startCountdown();
    });

    startCountdown();
});
          