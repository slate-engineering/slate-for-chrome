var Settings = (function () {
  //set default variables
  function Settings() {
    this._apiKeys = {};
    this._acceptedImages = {};
    this._historyLength = 0;
  }

  Settings.prototype.getApiKeys = async () => {
    var storage = new Promise(function (resolve, reject) {
      chrome.storage.local.get(["apis"], function (result) {
        resolve(result);
      });
    });

    return storage;
    //return keys;
  };

  Settings.prototype.saveApiKey = (props) => {
    chrome.storage.local.get(function (result) {
      var allUploads = [];
      if (result["apis"]) {
        allUploads = Object.values(result["apis"]);
      }
      if (!allUploads) {
        allUploads = props;
      } else {
        let dataArray = props;
        allUploads.push(dataArray);
      }
      chrome.storage.local.set({ apis: allUploads }, function () {
        console.log("saved!");
      });
    });
  };

  Settings.prototype.deleteApiKey = (props) => {
    chrome.storage.local.get(["apis"], function (result) {
      var apiKeys = [];
      apiKeys = Object.values(result["apis"]);
      let del = apiKeys.findIndex((x) => x.data.key === props);
      apiKeys.splice(del, 1);
      chrome.storage.local.set({ apis: apiKeys }, function () {
        location.reload();
      });
    });
  };

  Settings.prototype.validateApiKey = async (key) => {
    const response = await fetch("https://slate.host/api/v2/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: your API key
        Authorization: "Basic " + key,
      },
      body: JSON.stringify({
        data: {
          private: true,
        },
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.user) {
      return json;
    } else {
      return false;
    }
  };

  Settings.prototype.getAcceptedImages = async () => {
    let acceptedImages = [];
    chrome.storage.local.get(["settings"], (result) => {
      let imagesizes = result.settings.image_sizes;
      Object.entries(imagesizes).forEach((size) => {
        if (size[1] === true) {
          acceptedImages.push(size[0]);
        }
      });
    });

    return acceptedImages;
  };

  Settings.prototype.clearUploadsNumber = async () => {
    let currentUploads = 0;
    chrome.storage.local.set({ currentUploads: currentUploads });
  };

  Settings.prototype.newApiKey = (api) => {
    let APIInput = document.getElementById("existing-keys");
    let newAPIInput = document.createElement("div");
    newAPIInput.className = "slate-api-key";
    let photo;
    if (api.data.photo) {
      photo = api.data.photo;
    }
    newAPIInput.innerHTML =
      '<div class="slate-account name"><img class="slate-avatar" width="20px" src="' +
      photo +
      '"/>' +
      "<div>" +
      api.data.name +
      "</div>" +
      '</div><div class="slate-account key">XXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX</div><button class="slate-icon-button show active"><object class="slate-icon" type="image/svg+xml" data="../common/svg/eye.svg"></object></button><button class="slate-icon-button hide"><object class="slate-icon" type="image/svg+xml" data="../common/svg/eye-off.svg"></object></button><button class="slate-icon-button delete" onclick="_handleDelete(this.parentNode)"><object class="slate-icon" type="image/svg+xml" data="../common/svg/x.svg"></object></button>';
    APIInput.append(newAPIInput);
  };

  Settings.prototype.createApiKeyDropdown = async (api) => {
    let APIDropdown = document.getElementById("primary-key-select-dropdown");
    let newAPIDropdown = document.createElement("div");
    newAPIDropdown.innerHTML = api.data.name;
    newAPIDropdown.classList.add("slate-option");
    newAPIDropdown.setAttribute("date-apikey", api.data.key);
    newAPIDropdown.onclick = async () => {
      chrome.storage.local.get(["apis"], function (result) {
        var apiKeys = [];
        apiKeys = Object.values(result["apis"]);
        let data = apiKeys.find((x) => x.data.key === api.data.key);
        let del = apiKeys.findIndex((x) => x.data.key === api.data.key);
        apiKeys.splice(del, 1);
        apiKeys.unshift(data);
        chrome.storage.local.set({ apis: apiKeys }, function () {
          location.reload();
        });
      });
    };
    APIDropdown.append(newAPIDropdown);
  };

  Settings.prototype.createApiKey = async (api) => {
    let APIInput = document.getElementById("existing-keys");
    let newAPIInput = document.createElement("div");
    newAPIInput.className = "slate-api-key";
    let photo;
    if (api.data.photo) {
      photo = api.data.photo;
    }
    let name = "";
    if (api.data.photo) {
      name = api.data.name;
    }
    newAPIInput.innerHTML =
      '<div class="slate-account name"><img class="slate-avatar" width="20px" src="' +
      photo +
      '"/>' +
      "<div>" +
      name +
      "</div>" +
      '</div><input id="textbox-' +
      api.data.key +
      '" class="slate-account key" value="XXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX" /><button data-id="' +
      api.data.key +
      '" class="slate-icon-button existing-slate show active"><object class="slate-icon" type="image/svg+xml" data="../common/svg/eye.svg"></object></button><button class="slate-icon-button hide"><object class="slate-icon" type="image/svg+xml" data="../common/svg/eye-off.svg"></object></button><button class="slate-icon-button delete slate-icon-button-delete" id="' +
      api.data.key +
      '" class="slate-icon-button delete"><object class="slate-icon" type="image/svg+xml" data="../common/svg/x.svg"></object></button>';

    APIInput.append(newAPIInput);
  };

  Settings.prototype.notification = (api, type) => {
    let notification = document.getElementById("noti");
    notification.innerHTML =
      "Imported " + api.data.slates + " slates from " + api.data.name;
    notification.className = "show";
    if (type == "error") {
      notification.classList.add("noti-error");
      notification.innerHTML = "There was an error adding that API key.";
    }
    setTimeout(function () {
      notification.className = notification.className.replace("show", "");
    }, 3000);
  };

  return Settings;
})();

var settings = new Settings();

document.addEventListener("DOMContentLoaded", async () => {
  let apiKeys = await settings.getApiKeys();

  let loop = Object.values(apiKeys);

  if (apiKeys.apis) {
    if (apiKeys.apis[0]) {
      document.getElementById("slate-dropdown-title-default").innerHTML =
        apiKeys.apis[0].data.name;
    }
    for (i = 0; i < apiKeys.apis.length; i++) {
      await settings.createApiKeyDropdown(apiKeys.apis[i]);
      await settings.createApiKey(apiKeys.apis[i]);
    }
  }
  let deleteNow = document.getElementsByClassName("slate-icon-button-delete");
  Array.from(deleteNow).forEach(function (element) {
    element.addEventListener("click", function (e) {
      var r = confirm("Are you sure you want to delete this API key?");
      if (r == true) {
        settings.deleteApiKey(e.target.id);
      } else {
        return;
      }
    });
  });

  let showSlate = document.getElementsByClassName("existing-slate");
  Array.from(showSlate).forEach(function (element) {
    element.addEventListener("click", function (e) {
      let apiKeyTxt = document.getElementById(
        "textbox-" + e.target.attributes[0].value
      ).value;

      if (apiKeyTxt.startsWith("X")) {
        //console.log(e.target.attributes[0].value);
        document.getElementById(
          "textbox-" + e.target.attributes[0].value
        ).value = e.target.attributes[0].value;
      } else {
        document.getElementById(
          "textbox-" + e.target.attributes[0].value
        ).value = "XXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX";
      }
    });
  });

  document
    .getElementById("primary-key-select")
    .addEventListener("click", function () {
      document
        .getElementById("primary-key-select-dropdown")
        .classList.toggle("hide");
      document
        .getElementById("dropdown-icon-apikey-default")
        .classList.toggle("slate-dropdown-icon-rotate");
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
  let apiViewInput = document.getElementById("show-api-input-text");

  apiViewInput.addEventListener("click", function (e) {
    let input = document.getElementById("slate-api-input");
    if (input.type == "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  });

  //dropdown menu for selecting upload history time range
  let dropdownButton = document.getElementsByClassName(
    "slate-dropdown-title"
  )[0];
  let dropdownMenu = document.getElementsByClassName(
    "slate-dropdown-options"
  )[0];
  let dropdownOptions = document.getElementsByClassName("slate-option");
  //_handleTimeSelection(dropdownButton, dropdownMenu, dropdownOptions);

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
    //_handleVisibility(hideButtons, showButtons, keys);
  };
  let observer = new MutationObserver(callback);
  observer.observe(targetNode, observerOptions);
});

_handleValidation = (inputKeys, validateKeyButtons) => {
  for (let i = 0; i < inputKeys.length; i++) {
    inputKeys[i].addEventListener("input", () => {
      validateKeyButtons[i].disabled = false;
    });
  }
};

_handleDelete = (props) => {
  props.remove();
  console.log(props);
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
      let type = "error";
      let api = {
        slates: "no",
        name: "no",
      };
      settings.notification(api, type);
    } else {
      btn.setAttribute("data", "../common/svg/arrow-right-circle.svg");
      btn.classList.toggle("rotate");
      btn.disabled = true;
      document.getElementById("slate-api-input").value = "";
      document.getElementById("slate-name-input").value = "";
      let photo = validate.user.data.photo;
      let slates = validate.collections.length;
      let name;
      if (nameValue) {
        name = nameValue;
      } else {
        name = validate.user.username || validate.user.data.name;
      }
      let api = {
        data: {
          name: name,
          photo: photo,
          key: keyValue,
          slates: slates,
        },
      };
      settings.newApiKey(api);
      settings.saveApiKey(api);
      let type = "success";
      settings.notification(api, type);
      location.reload();
      //setttings.openConfirmModal(text, img, btn)
      //document.getElementById("slate-modal").style.display = "fixed";
    }
  });

document
  .getElementById("clear-upload-num-btn")
  .addEventListener("click", function (e) {
    let modal = confirm(
      "Use this if your files have uploaded to Slate, but the app still shows an in-progress upload. Are you sure you want to clear?"
    );
    if (modal == true) {
      settings.clearUploadsNumber();
      location.reload();
    } else {
      return;
    }
  });
