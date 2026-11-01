/* ================================= */
/* NAVIGATION SYSTEM */
/* ================================= */

/* ================================ */
/* NAVIGATE PAGE */
/* ================================ */

function navigate(pageId) {
  const pages = document.querySelectorAll(".page");

  pages.forEach(function (page) {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }
}

/* ================================ */
/* INITIAL PAGE LOAD */
/* ================================ */

document.addEventListener("DOMContentLoaded", function () {
  navigate("home");
});
