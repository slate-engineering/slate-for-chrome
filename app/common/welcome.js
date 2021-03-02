document.addEventListener("DOMContentLoaded", () => {
  let helperButton = document.getElementsByClassName("slate-helper-button");
  helperButton[0].addEventListener("click", () => _handleExpand(helperButton[0]));

  let visibilityButton = document.getElementsByClassName("slate-icon-wrapper visibility");
  let input = document.getElementById("slate-api-input");
  visibilityButton[0].addEventListener("click", () => _handleVisibility(visibilityButton, input, false));
  visibilityButton[1].addEventListener("click", () => _handleVisibility(visibilityButton, input, true));

  let getStarted = document.getElementById("get-started");
  let keyValue = input.value;
  input.addEventListener("input", () => {
    getStarted.classList.remove("disabled");
  });

  getStarted.addEventListener("click", () => {
    keyValue = input.value;
    createAPIs(keyValue);
  });

  createSettings();
  createUploads();
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
    url: "https://slate.textile.io/ipfs/bafkreiepfcul4ortkdvxkqe4hfbulggzvlcijkr3mgzfhnbbrcgwlykvxu",
    uploading: false,
  };
  uploads.push(upload);
  chrome.storage.local.set({ uploads });
  chrome.storage.local.get(["uploads"], (result) => {
    console.log("uploads", result);
  });
};
