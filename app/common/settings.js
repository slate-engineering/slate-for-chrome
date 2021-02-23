document.addEventListener("DOMContentLoaded", () => {
  //enable validation button when input event fires
  let inputKeys = document.getElementsByClassName("slate-input key");
  let validateKeyButtons = document.getElementsByClassName("slate-icon-button validate");
  _handleValidation(inputKeys, validateKeyButtons);

  //toggle api key visibility
  let keys = document.getElementsByClassName("slate-key");
  let showButtons = document.getElementsByClassName("slate-icon-button show");
  let hideButtons = document.getElementsByClassName("slate-icon-button hide");
  _handleVisibility(hideButtons, showButtons, keys);

  //dropdown menu for selecting upload history time range
  let dropdownButton = document.getElementsByClassName("slate-dropdown-title")[0];
  let dropdownMenu = document.getElementsByClassName("slate-dropdown-options")[0];
  let dropdownOptions = document.getElementsByClassName("slate-option");
  _handleTimeSelection(dropdownButton, dropdownMenu, dropdownOptions);

  //checking for DOM update with mutation observer api
  let targetNode = document.querySelector("#api-keys");
  let observerOptions = {
    childList: true,
    subtree: true,
  };
  let callback = () => {
    _handleValidation(inputKeys, validateKeyButtons);
    keys = document.getElementsByClassName("key");
    showButtons = document.getElementsByClassName("slate-icon-button show");
    hideButtons = document.getElementsByClassName("slate-icon-button hide");
    _handleVisibility(hideButtons, showButtons, keys);
  };
  let observer = new MutationObserver(callback);
  observer.observe(targetNode, observerOptions);
});

_handleVisibility = (hideButtons, showButtons, keys) => {
  for (let i = 0; i < hideButtons.length; i++) {
    hideButtons[i].addEventListener("click", () => {
      hideButtons[i].classList.remove("active");
      showButtons[i].classList.add("active");
      if (keys[i].type === "text") {
        keys[i].type = "password";
      }
    });
    showButtons[i].addEventListener("click", () => {
      hideButtons[i].classList.add("active");
      showButtons[i].classList.remove("active");
      if (keys[i].type === "password") {
        keys[i].type = "text";
      }
    });
  }
};

_handleAdd = () => {
  let APIInput = document.getElementById("api-keys");
  let newAPIInput = document.createElement("div");
  newAPIInput.className = "slate-api-key";
  newAPIInput.innerHTML =
    '<input class="slate-input name" placeholder="Name" /><input class="slate-input key" type="password" placeholder="XXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX" /><button class="slate-icon-button validate" disabled><object class="slate-icon" type="image/svg+xml" data="../common/svg/arrow-right-circle.svg"></object></button><button class="slate-icon-button show active"><object class="slate-icon" type="image/svg+xml" data="../common/svg/eye.svg"></object></button><button class="slate-icon-button hide"><object class="slate-icon" type="image/svg+xml" data="../common/svg/eye-off.svg"></object></button><button class="slate-icon-button delete" onclick="_handleDelete(this.parentNode)"><object class="slate-icon" type="image/svg+xml" data="../common/svg/x.svg"></object></button>';
  APIInput.append(newAPIInput);
};

_handleValidation = (inputKeys, validateKeyButtons) => {
  for (let i = 0; i < inputKeys.length; i++) {
    inputKeys[i].addEventListener("input", () => {
      validateKeyButtons[i].disabled = false;
    });
  }
};

_handleDelete = (props) => {
  props.remove();
};

_handleOptionSelection = (dropdownOptions, selection) => {
  for (let i = 0; i < dropdownOptions.length; i++) {
    let isCurrentSelection = dropdownOptions[i].classList.contains("selected");
    if (isCurrentSelection) {
      if (i !== selection) {
        dropdownOptions[i].classList.remove("selected");
      }
    } else if (i === selection) {
      dropdownOptions[i].classList.add("selected");
    }
  }
  let dropdownTitle = document.getElementsByClassName("slate-dropdown-title")[0];
  let dropdownIcon = document.getElementById("dropdown-icon");
  dropdownTitle.textContent = dropdownOptions[selection].textContent;
  dropdownTitle.append(dropdownIcon);
};

toggleMenuDisplay = (dropdownMenu) => {
  let menuHidden = dropdownMenu.classList.contains("hide");
  let dropdownIcon = document.getElementById("dropdown-icon");
  if (menuHidden) {
    dropdownMenu.classList.remove("hide");
    dropdownIcon.classList.add("rotate");
  } else {
    dropdownMenu.classList.add("hide");
    dropdownIcon.classList.remove("rotate");
  }
};

_handleTimeSelection = (dropdownButton, dropdownMenu, dropdownOptions) => {
  dropdownButton.addEventListener("click", () => toggleMenuDisplay(dropdownMenu));
  for (let i = 0; i < dropdownOptions.length; i++) {
    dropdownOptions[i].addEventListener("click", () => {
      _handleOptionSelection(dropdownOptions, i);
    });
  }
};
