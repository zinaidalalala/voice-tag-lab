// script.js
window.onscroll = function () {
  updateProgressBar();
  changeHeaderStyle();
};

function updateProgressBar() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";
}


function changeHeaderStyle() {
  var header = document.querySelector(".header__wrapper");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    header.style.backgroundColor = "black";
    header.style.color = "white";
  } else {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    header.style.color = "#fff";
  }
}
