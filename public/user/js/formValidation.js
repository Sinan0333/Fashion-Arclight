// Wrap your code in a DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const password = document.getElementById('password');
    const confirmpassword = document.getElementById('confirmpassword')
    const confirmpasswordError = document.getElementById('confirmpasswordError')
    const passwordLengthError = document.getElementById('passwordLengthError')
    const emailError = document.getElementById("emailError");
    const mobile = document.getElementById('mobile')
    const mobileLngthErrror = document.getElementById('mobileLngthErrror')
    const nameInput = document.getElementById("name");
    const nameLengthError = document.getElementById('nameLengthError')
    const pincode = document.getElementById('pincode')
    const pincodeLngthErrror = document.getElementById('pincodeLngthErrror')
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    document.getElementById("form").addEventListener("submit", function (event) {
        if(emailInput){
            if (emailInput.value.trim() === "") {
                emailError.textContent = "Email is required.";
                event.preventDefault();
            } else if (!emailPattern.test(emailInput.value)) {
                emailError.textContent = "Invalid email format.";
                event.preventDefault();
            } else {
                emailError.textContent = "";
            }
        }
       if(mobile){
            if (mobile.value.length != 10) {
                mobileLngthErrror.textContent = "Type a  10 digit mobiel number"
                event.preventDefault()
            } else {
                mobileLngthErrror.textContent = ""
            }
       }
       if(nameInput){
            if (nameInput.value.length < 4 || nameInput.value.trim() === "") {
                nameLengthError.textContent = "User name  must be at least 4 characters"
                event.preventDefault()
            } else {
                nameLengthError.textContent = ""
            }
       }
       if(pincode){
            if (pincode.value.length != 6) {
                pincodeLngthErrror.textContent = "Type a  6 digit Pincode"
                event.preventDefault()
            }
            else {
                pincodeLngthErrror.textContent = ""
            }
       } 
       if(password.value){
        if(password && confirmpassword){
            if (password.value !== confirmpassword.value) {
                confirmpasswordError.textContent = "Password doesn't match"
                event.preventDefault()
            } else {
                confirmpasswordError.textContent = ""
            }
            if (password.value.length < 8) {
                passwordLengthError.textContent = "Password must be at least 8 characters"
                event.preventDefault()
            } else {
                passwordLengthError.textContent = ""
            }
        }else{
            if (password.value.length < 8) {
                passwordLengthError.textContent = "Password must be at least 8 characters"
                event.preventDefault()
            } else {
                passwordLengthError.textContent = ""
            }
        }       
       }   
    });
});
