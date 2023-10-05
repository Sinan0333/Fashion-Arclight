
 // Function to preview the selected profile picture
 
 function previewImage(event) {
    const input = event.target;
    const image = document.getElementById('profile-picture'); // Select the img element by its id

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

