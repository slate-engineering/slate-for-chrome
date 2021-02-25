var Settings = (function () {
  //set default variables
  function Settings() {
    this._apiKeys = {};
    this._acceptedImages = {};
    this._historyLength = 0;
  }

  Settings.prototype.getApiKeys = () => {
    //TODO (@jason/tara)
    //Add chrome local storage get for all api keys
    //
    //TEST apiKeys
    //Can be deleted after local storage is added
    var keys = [
      {
        id: "1",
        name: "Work",
        key: "123123123",
        photo: "https://www.scalevp.com/sites/default/files/designbig.jpg",
        position: 1,
      },
    ];
    return keys;
  };

  Settings.prototype.saveApiKey = (props) => {
    //TODO (@jason/@tara)
    //see line 245
    //Save api key data in local storage
    console.log(props);
    return true;
  };

  Settings.prototype.validateApiKey = async (key) => {
    const response = await fetch("https://slate.host/api/v1/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: your API key
        Authorization: "Basic " + key,
      },
      body: JSON.stringify({
        data: {
          // NOTE: optional, if you want your private slates too.
          private: false,
        },
      }),
    });
    const json = await response.json();
    console.log(json.user);
    if (json.user) {
      return json;
    } else {
      return false;
    }
  };

  Settings.prototype.getAcceptedImages = () => {
    //TODO (@jason/tara)
    //Get accepted images from local storage (where = true)
    return this._acceptedImages;
  };

  Settings.prototype.createApiKey = (api) => {
    let APIInput = document.getElementById("existing-keys");
    let newAPIInput = document.createElement("div");
    newAPIInput.className = "slate-api-key";
    newAPIInput.innerHTML =
      '<div class="slate-account name"><img class="slate-avatar" width="24px" src="' +
      api.photo +
      '"/>' +
      api.name +
      '</div><div class="slate-account key">XXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX</div><button class="slate-icon-button show active"><object class="slate-icon" type="image/svg+xml" data="../common/svg/eye.svg"></object></button><button class="slate-icon-button hide"><object class="slate-icon" type="image/svg+xml" data="../common/svg/eye-off.svg"></object></button><button class="slate-icon-button delete" onclick="_handleDelete(this.parentNode)"><object class="slate-icon" type="image/svg+xml" data="../common/svg/x.svg"></object></button>';
    APIInput.append(newAPIInput);
  };

  Settings.prototype.notification = (api, type) => {
    let notification = document.getElementById("noti");
    notification.innerHTML =
      "Imported " + api.slates + " slates from " + api.name;
    notification.className = "show";
    setTimeout(function () {
      notification.className = notification.className.replace("show", "");
    }, 3000);
  };

  return Settings;
})();

var settings = new Settings();

document.addEventListener("DOMContentLoaded", () => {
  const apiKeys = Array.from(settings.getApiKeys());
  apiKeys.forEach((api, i) => {
    settings.createApiKey(api);
  });

  //enable validation button when input event fires
  let inputKeys = document.getElementsByClassName("slate-input key");
  let validateKeyButtons = document.getElementsByClassName(
    "slate-icon-button validate"
  );
  _handleValidation(inputKeys, validateKeyButtons);

  //toggle api key visibility
  let keys = document.getElementsByClassName("slate-key");
  let showButtons = document.getElementsByClassName("slate-icon-button show");
  let hideButtons = document.getElementsByClassName("slate-icon-button hide");
  _handleVisibility(hideButtons, showButtons, keys);

  //dropdown menu for selecting upload history time range
  let dropdownButton = document.getElementsByClassName(
    "slate-dropdown-title"
  )[0];
  let dropdownMenu = document.getElementsByClassName(
    "slate-dropdown-options"
  )[0];
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
  let dropdownTitle = document.getElementsByClassName(
    "slate-dropdown-title"
  )[0];
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
  dropdownButton.addEventListener("click", () =>
    toggleMenuDisplay(dropdownMenu)
  );
  for (let i = 0; i < dropdownOptions.length; i++) {
    dropdownOptions[i].addEventListener("click", () => {
      _handleOptionSelection(dropdownOptions, i);
    });
  }
};

document
  .getElementById("slate-validate-btn")
  .addEventListener("click", async () => {
    let btn = document.getElementById("slate-validate-obj");
    let keyValue = document.getElementById("slate-api-input").value;
    let nameValue = document.getElementById("slate-name-input").value;

    btn.setAttribute("data", "../common/svg/loading.svg");
    btn.classList.toggle("rotate");
    //Validate key
    let validate = await settings.validateApiKey(keyValue);
    if (!validate) {
      btn.setAttribute("data", "../common/svg/arrow-right-circle.svg");
      btn.classList.toggle("rotate");
      console.log("There was an error validating the api key");
    } else {
      btn.setAttribute("data", "../common/svg/arrow-right-circle.svg");
      btn.classList.toggle("rotate");
      btn.disabled = true;
      document.getElementById("slate-api-input").value = "";
      document.getElementById("slate-name-input").value = "";
      settings.saveApiKey(validate);
      let photo = validate.user.data.photo;
      let slates = validate.slates.length;
      let name;
      if (nameValue) {
        name = nameValue;
      } else {
        name = validate.user.username;
      }
      let api = {
        name: name,
        photo: photo,
        key: keyValue,
        slates: slates,
      };
      settings.createApiKey(api);
      let type = "success";
      settings.notification(api, type);
      //setttings.openConfirmModal(text, img, btn)
      //document.getElementById("slate-modal").style.display = "fixed";
    }
  });
