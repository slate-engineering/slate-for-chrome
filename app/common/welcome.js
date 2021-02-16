document.addEventListener("DOMContentLoaded", () => {
  let helperButton = document.getElementsByClassName("helper-button");
  helperButton[0].addEventListener("click", () => _handleExpand(helperButton[0]));
});

_handleExpand = (props) => {
  props.classList.toggle("active");
  let helperInfo = props.nextElementSibling;
  if (helperInfo.classList.contains("active")) {
    helperInfo.classList.remove("active");
  } else {
    helperInfo.classList.add("active");
  }
};
