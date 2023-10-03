document.getElementById("form").addEventListener("submit", function (event) {
    const emailInput = document.getElementById("email");
    const password = document.getElementById('password');
    const confirmpassword = document.getElementById('confirmpassword')
    const confirmpasswordError=document.getElementById('confirmpasswordError')
    const  passwordLengthError=document.getElementById('passwordLengthError')
    const emailError = document.getElementById("emailError");
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if (emailInput.value.trim() === "") {
        emailError.textContent = "Email is required.";
        event.preventDefault();
    } else if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = "Invalid email format.";
        event.preventDefault();
    } else {
        emailError.textContent = "";
    }
    if(password.value!==confirmpassword.value){
        confirmpasswordError.textContent="Password doesn't match"
        event.preventDefault()
    }else{
        confirmpasswordError.textContent=""
    }
    if(password.value.length<8){
        passwordLengthError.textContent="Password must be at least 8 character"
        event.preventDefault()
    }else{
        passwordLengthError.textContent=""
    }

});