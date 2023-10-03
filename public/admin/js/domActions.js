// Get the modal and buttons
var modal = document.getElementById("categoryModal");
var addCategoryBtn = document.getElementById("addCategoryBtn");
var closeBtn = document.getElementsByClassName("close")[0];
var saveCategoryBtn = document.getElementById("saveCategoryBtn");

// Open the modal when the "Add Category" button is clicked
addCategoryBtn.onclick = function () {
  modal.style.display = "block";
};

// Close the modal when the close button is clicked
closeBtn.onclick = function () {
  modal.style.display = "none";
};

// Close the modal when clicking outside the modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Save category logic here (you can use AJAX to send the data to the server)
saveCategoryBtn.onclick = function () {
  // Get the category name and block status from the form
  var categoryName = document.getElementById("categoryName").value;
  var blockStatus = document.getElementById("blockStatus").checked;

  // You can perform further actions here, like sending data to the server
  // using AJAX to save the category.

  // Close the modal after saving
  modal.style.display = "none";
};




document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".edit-button");
  const closeButtons = document.querySelectorAll(".close");

  // Function to hide the modal when the close button is clicked
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
  }

  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const categoryId = button.getAttribute("data-category-id");
      const modalId = `categoryEditModal_${categoryId}`;
      const modal = document.getElementById(modalId);
      modal.style.display = "block";
    });
  });

  closeButtons.forEach(function (closeButton) {
    closeButton.addEventListener("click", function () {
      const modalId = closeButton.getAttribute("data-modal-id");
      closeModal(modalId);
    });
  });
});

