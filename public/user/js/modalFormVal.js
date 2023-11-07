function validate(){
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const mobile = document.getElementById('mobile')
    const mobileLngthErrror = document.getElementById('mobileLngthErrror')
    const nameInput = document.getElementById("name");
    const nameLengthError = document.getElementById('nameLengthError')
    const pincode = document.getElementById('pincode')
    const pincodeLngthErrror = document.getElementById('pincodeLngthErrror')
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var success =true

    if(emailInput){
        if (emailInput.value.trim() === "") {
            emailError.textContent = "Email is required.";
            event.preventDefault();
            success =false
        } else if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = "Invalid email format.";
            event.preventDefault();
            success =false
        } else {
            emailError.textContent = "";
        }
    }
    if(mobile){
        if (mobile.value.length < 10) {
            mobileLngthErrror.textContent = "Mobile number must be at least 10 digits"
            event.preventDefault()
            success =false
        } else {
            mobileLngthErrror.textContent = ""
        }
   }
   if(nameInput){
        if (nameInput.value.length < 4) {
            nameLengthError.textContent = "User name  must be at least 4 characters"
            event.preventDefault()
            success =false
        } else {
            nameLengthError.textContent = ""
        }
   }
   if(pincode){
        if (pincode.value.length != 6) {
            pincodeLngthErrror.textContent = "Type a  6 digit Pincode"
            event.preventDefault()
            success =false
        }
        else {
            pincodeLngthErrror.textContent = ""
        }
   } 
   if(success){
    return true
}else{
    return false
}
}
