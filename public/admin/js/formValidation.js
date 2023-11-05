
document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const nameLengthError = document.getElementById('nameLengthError')
    const discount = document.getElementById("discount")
    const discountError = document.getElementById('discountError')
    const criteriaAmount = document.getElementById('criteriaAmount')
    const criteriaAmountErr = document.getElementById('criteriaAmountErr')
    const userLimit = document.getElementById("userLimit")
    const userLimitErr = document.getElementById('userLimitErr')
    const price = document.getElementById('price')
    const priceErr = document.getElementById('priceErr')
    const quantity = document.getElementById('quantity')
    const quantityErr = document.getElementById('quantityErr')
    const coupon = document.getElementById('coupon')
    const couponErr = document.getElementById('couponLengthError')

    document.getElementById("form").addEventListener("submit", function (event) {
        if(nameInput){
            if (nameInput.value.length < 4) {
                nameLengthError.textContent = " name  must be at least 4 characters"
                event.preventDefault()
            } else {
                nameLengthError.textContent = ""
            }
        }
        if(discount){
            if (discount.value < 0) {
                discountError.textContent = "Discout amount must be positive"
                event.preventDefault()
            } else {
                discountError.textContent = ""
            }
        }
        if(criteriaAmount){
            if (criteriaAmount.value < 0) {
                criteriaAmountErr.textContent = "Criteria amount must be positive"
                event.preventDefault()
            } else {
                criteriaAmountErr.textContent = ""
            }
        }
        if(userLimit){
            if (userLimit.value < 0) {
                userLimitErr.textContent = "User linit  must be positive"
                event.preventDefault()
            } else {
                userLimitErr.textContent = ""
            }
        }
        if(price){
            if (price.value < 0) {
                priceErr.textContent = "Price  must be positive"
                event.preventDefault()
            } else {
                priceErr.textContent = ""
            }
        }
        if(quantity){
            if (quantity.value < 0) {
                quantityErr.textContent = "Quantity  must be positive"
                event.preventDefault()
            } else {
                quantityErr.textContent = ""
            }
        }
        if(coupon){
            if (coupon.value.length < 6) {
                couponErr.textContent = " Coupon code must be at least 6 characters"
                event.preventDefault()
            } else {
                couponErr.textContent = ""
            }
        }
       
    });
});
