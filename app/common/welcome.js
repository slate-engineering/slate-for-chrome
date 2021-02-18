document.addEventListener("DOMContentLoaded", () => {
  let helperButton = document.getElementsByClassName("helper-button");
  helperButton[0].addEventListener("click", () => _handleExpand(helperButton[0]));

  let visibilityButton = document.getElementsByClassName("icon-wrapper visibility");
  let input = document.getElementById("api-key");
  visibilityButton[0].addEventListener("click", () => _handleVisibility(visibilityButton, input, false));
  visibilityButton[1].addEventListener("click", () => _handleVisibility(visibilityButton, input, true));

  let getStarted = document.getElementById("get-started");
  input.addEventListener("input", () => getStarted.classList.remove("disabled"));
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

_handleVisibility = (visibilityButton, input, visible) => {
  if (visible) {
    visibilityButton[1].classList.remove("active");
    visibilityButton[0].classList.add("active");
    input.type = "text";
  } else {
    visibilityButton[0].classList.remove("active");
    visibilityButton[1].classList.add("active");
    input.type = "password";
  }
};
