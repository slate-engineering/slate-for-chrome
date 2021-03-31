var Welcome = (function () {
  //set default variables
  function Welcome() {}

  Welcome.prototype.installApp = () => {
    chrome.storage.local.get(["uploads"], (result) => {
      console.log(result.uploads);
      if (result.uploads == null) {
        let uploads = [];
        chrome.storage.local.set({ uploads: uploads });
      }
    });

    chrome.storage.local.get(["apis"], (result) => {
      console.log(result.apis);
      if (result.apis == null) {
        let apis = [];
        chrome.storage.local.set({ apis: apis });
      }
    });

    chrome.storage.local.get(["currentUploads"], (result) => {
      console.log(result.currentUploads);
      if (result.currentUploads == null) {
        let currentUploads = 0;
        chrome.storage.local.set({ currentUploads: currentUploads });
      }
    });
  };

  Welcome.prototype.saveApiKey = (props) => {
    console.log("props outside", props);

    chrome.storage.local.get(function (result) {
      var allUploads = [];
      console.log("result: ", result["apis"]);
      if (result["apis"]) {
        allUploads = Object.values(result["apis"]);
      }
      console.log(allUploads);
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

  Welcome.prototype.validateApiKey = async (key) => {
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
    console.log(json);
    if (json.user) {
      return json;
    } else {
      return false;
    }
  };

  return Welcome;
})();

var welcome = new Welcome();

document.addEventListener("DOMContentLoaded", () => {
  welcome.installApp();

  let helperButton = document.getElementsByClassName("slate-helper-button");
  helperButton[0].addEventListener("click", () =>
    _handleExpand(helperButton[0])
  );

  let visibilityButton = document.getElementsByClassName(
    "slate-icon-wrapper visibility"
  );
  let input = document.getElementById("slate-api-input");
  visibilityButton[0].addEventListener("click", () =>
    _handleVisibility(visibilityButton, input, false)
  );
  visibilityButton[1].addEventListener("click", () =>
    _handleVisibility(visibilityButton, input, true)
  );

  let getStarted = document.getElementById("get-started");
  let keyValue = input.value;
  input.addEventListener("input", () => {
    getStarted.classList.remove("disabled");
  });

  getStarted.addEventListener("click", async () => {
    document.getElementById("slate-api-loading").style.display = "inline";
    keyValue = input.value;
    let validate = await welcome.validateApiKey(keyValue);
    if (!validate) {
      console.log("There was an error validating the api key");
    } else {
      console.log(validate);
      let photo = validate.user.data.photo;
      let slates = validate.slates.length;
      let name = validate.user.username;
      let api = {
        data: { name: name, photo: photo, key: keyValue, slates: slates },
      };
      welcome.saveApiKey(api);
      document.getElementById("slate-api-loading").style.display = "none";
      document.getElementById("slate-api-success").style.display = "inline";
      setTimeout(function () {
        document.getElementById("how-it-works").scrollIntoView({
          behavior: "smooth",
        });
      }, 1000);
    }
  });
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

//setting up local db
createAPIs = (keyValue) => {
  let apis = [];
  let apiKey = {
    username: "tara",
    key: keyValue,
    data: {
      photo: "https://unsplash.com/photos/lvh5L46VWuA",
      name: "tlin",
    },
    slates: ["perfect-blue", "memory palace"],
  };
  apis.push(apiKey);
  chrome.storage.local.set({ apis });
};

createSettings = () => {
  let settings = {
    image_sizes: { icon: true, small: true, medium: true, large: true },
    upload_history_range: "last 3 months",
  };
  chrome.storage.local.set({ settings });
};

createUploads = () => {
  let uploads = [];
  //TODO (@Tara/@Jason): this can be deleted later
  let upload = {
    name: "jim-dark-secrets.png",
    type: "image/jpeg",
    source: "https://www.criterion.com/shop/collection/169-wes-anderson",
    cid: "a238149phsdfaklsjdfhlqw48rlfsad",
    date: "2020-10-13T19:49:41.036Z",
    url:
      "https://slate.textile.io/ipfs/bafkreiepfcul4ortkdvxkqe4hfbulggzvlcijkr3mgzfhnbbrcgwlykvxu",
    uploading: false,
    id: "jasonwillfigureouthowtodotheids",
  };
  uploads.push(upload);
  chrome.storage.local.set({ uploads });
  chrome.storage.local.get(["uploads"], (result) => {
    console.log("uploads", result.uploads);
  });
};
