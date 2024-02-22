// Selecteren van elementen en ze een naam geven
const legend = document.querySelector("legend"),
      dropdown = document.querySelector("form.dropdown");


// Fuctie om de class "show" aan een lables te togglen(aan/uit)
function toggleFilter() {
  dropdown.classList.toggle('show');
}

// als je klikt op dit element dan voer deze funtie uit.
legend.addEventListener("click", toggleFilter)
