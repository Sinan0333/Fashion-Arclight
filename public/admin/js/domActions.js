// Get the modal and buttons
var modal = document.getElementById("categoryModal");
var addCategoryBtn = document.getElementById("addCategoryBtn");
var closeBtn = document.getElementsByClassName("close")[0];
var saveCategoryBtn = document.getElementById("saveCategoryBtn");

addCategoryBtn.onclick = function () {
  modal.style.display = "block";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

saveCategoryBtn.onclick = function () {
  var categoryName = document.getElementById("categoryName").value;
  var blockStatus = document.getElementById("blockStatus").checked;
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

