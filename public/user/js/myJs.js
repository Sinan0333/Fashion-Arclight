// Show add addres form show button action
document.getElementById('tab-addAddress-link').addEventListener('click', function() {
    document.getElementById('tab-address').classList.remove('show', 'active');
    document.getElementById('tab-addAddress').classList.add('show', 'active');

    const closeAddAddressFormButton = document.getElementById('closeAddAddressForm');
    const tabAddAddress = document.getElementById('tab-addAddress');

    closeAddAddressFormButton.addEventListener('click', function () {
    tabAddAddress.style.display = 'none';
    document.getElementById('tab-address').classList.add('show', 'active');
});
});

// Edit profile
const editProfileButton = document.getElementById("editProfileButton");
const editProfileForm = document.getElementById("editProfileForm");
const saveProfileButton = document.getElementById("saveProfileButton");

editProfileButton.addEventListener("click", () => {

editProfileForm.style.display = "block";
});

// saveProfileButton.addEventListener("click", () => {
// editProfileForm.style.display = "none";

// });


 // Function to preview the selected profile picture
function previewProfilePicture(event) {
    const profilePicture = document.getElementById("profile-picture");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            profilePicture.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}
