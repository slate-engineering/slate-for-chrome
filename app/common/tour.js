//inject product-tour html into the test platform webpage
$(document).ready(() => {
  $.get(chrome.extension.getURL("./app/pages/product-tour.html"), function (data) {
    $(data).prependTo("body");
    console.log("html added");
    _handleNavigation();
  });
  // let images = document.getElementsByClassName("_2UGKr");
  // console.log(images[1]);
  // var rect = images[1].getBoundingClientRect();
  // console.log(rect);
});
