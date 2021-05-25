var Uploads = function () {
  this.uploadData = [];
};

Uploads.prototype.getUploads = async () => {
  var storage = new Promise(function (resolve, reject) {
    chrome.storage.local.get(["uploads"], function (result) {
      resolve(result);
    });
  });

  let getData = await storage;
  return getData;
};

Uploads.prototype.clearUploads = async () => {
  let allUploads = [];
  chrome.storage.local.set({ uploads: allUploads }, function () {
    console.log("uploads cleared");
    return;
  });
};

Uploads.prototype.clearUploadsNumber = async () => {
  let currentUploads = 0;
  chrome.storage.local.set({ currentUploads: currentUploads }, function () {
    console.log("upload number reset");
    return;
  });
};

Uploads.prototype.showUploads = (upload, filetype, status, cid, slateUrl) => {
  let uploadTable = document.getElementById("slate-uploads");
  let uploadEntries = document.createElement("div");
  let fileTypeIcon = document.createElement("div");
  let popOver = document.createElement("div");

  var username = "Direct upload";
  if (slateUrl != "https://slate.host/_?scene=NAV_DATA") {
    let pathname = slateUrl.split("/");
    username = pathname[3];
  }

  popOver.innerHTML =
    '<div class="slate-popover"><div class="slate-popover-item slate-no-link">Account: ' +
    username +
    '</div><hr style="border: 0.5px solid #f8f8f8"/><div class="slate-popover-item click-open-cid" data-cid="' +
    cid +
    '" data-slateUrl="' +
    slateUrl +
    '" id="viewOnSlate">View file on Slate</div><div class="slate-popover-item click-open-raw" data-cid="' +
    cid +
    '" id="viewRawFile">View raw file</div></div>';

  if (filetype.startsWith("image/")) {
    fileTypeIcon.innerHTML =
      '<object class="slate-icon-large" type="image/svg+xml" data="../common/svg/image.svg"></object>';
  }

  if (filetype.startsWith("text/")) {
    fileTypeIcon.innerHTML =
      '<object class="slate-icon-large" type="image/svg+xml" data="../common/svg/text.svg"></object>';
  }

  uploadEntries.className = "slate-table-row";

  uploadEntries.innerHTML =
    upload
      .map((uploadInfo, i) =>
        i === 0
          ? '<div class="slate-icon-column"><div class="slate-file-icon">' +
            fileTypeIcon.innerHTML +
            "</div>" +
            "<div>" +
            uploadInfo +
            "</div>" +
            "</div>"
          : i === 2
          ? '<div class="slate-icon-column">' +
            '<div id="sourceUrl" data-url="' +
            uploadInfo +
            '" class="slate-link-info">' +
            uploadInfo +
            "</div>" +
            "</div>"
          : '<div class="slate-column-width">' + uploadInfo + "</div>"
      )
      .join("") +
    '<div class="slate-dropdown"><object class="slate-icon-large" type="image/svg+xml" data="../common/svg/more-horizontal.svg"></object></div>' +
    popOver.innerHTML;
  uploadTable.appendChild(uploadEntries);
};

Uploads.prototype.toggleDropdownDisplay = () => {
  let dropdownBtns = document.getElementsByClassName("slate-dropdown");
  for (let dropdownBtn of dropdownBtns) {
    dropdownBtn.onclick = (e) => {
      if (dropdownBtn.nextElementSibling.style.display === "block") {
        dropdownBtn.nextElementSibling.style.display = "none";
      } else {
        dropdownBtn.nextElementSibling.style.display = "block";
      }
    };
  }
};

var uploads = new Uploads();

document.addEventListener("DOMContentLoaded", async () => {
  //TODO (@Tara/@Jason) bug: nothing gets returned here
  let existingUploads = await uploads.getUploads();
  //console.log("existingUploads", existingUploads);

  if (existingUploads.uploads.length > 0) {
    let sort = existingUploads.uploads.reverse();
    const isSuccessful = sort.filter((success) => success.uploading != "error");

    isSuccessful.forEach((upload) => {
      let date = new Date(upload.date);
      let dateFormat = date.toLocaleString();
      let str = upload.name;
      if (upload.name.length > 45) str = upload.name.substring(0, 45) + "...";

      uploadInfo = [str, dateFormat, upload.source];
      //console.log(upload);
      uploads.showUploads(
        uploadInfo,
        upload.type,
        upload.uploading,
        upload.cid,
        upload.slateUrl
      );
    });

    uploads.toggleDropdownDisplay();

    let openLink = document.getElementsByClassName("slate-link-info");
    for (var i = 0; i < openLink.length; i++) {
      openLink[i].onclick = function (e) {
        let url = e.target.attributes["data-url"].value;
        var win = window.open(url, "_blank");
        win.focus();
      };
    }

    let openCID = document.getElementsByClassName("click-open-cid");
    for (var i = 0; i < openCID.length; i++) {
      openCID[i].onclick = function (e) {
        let oldSlateUrl = e.target.attributes["data-slateUrl"].value;

        var newSlateUrl;
        if (oldSlateUrl == "https://slate.host/_?scene=NAV_DATA") {
          newSlateUrl = "https://slate.host/_?scene=NAV_DATA";
        } else {
          newSlateUrl = 
            `${e.target.attributes["data-slateUrl"].value}?cid=${e.target.attributes["data-cid"].value}`;
        }
        let win = window.open(newSlateUrl, "_blank");
        win.focus();
      };
    }

    let openRaw = document.getElementsByClassName("click-open-raw");
    for (var i = 0; i < openRaw.length; i++) {
      openRaw[i].onclick = function (e) {
        let url =
          "https://slate.textile.io/ipfs/" +
          e.target.attributes["data-cid"].value;
        var win = window.open(url, "_blank");
        win.focus();
      };
    }

    let openExternal = document.getElementsByClassName("slate-open-external");
    for (var i = 0; i < openExternal.length; i++) {
      openExternal[i].onclick = function (e) {
        //console.log("none");
      };
    }

    let copyCID = document.getElementsByClassName("click-copy-cid");
    for (var i = 0; i < copyCID.length; i++) {
      copyCID[i].onclick = function (e) {
        let url = `https://slate.textile.io/ipfs/${e.target.attributes["data-cid"].value}`;
        url.select();
        document.execCommand("copy");
        //console.log("copied");
      };
    }

    document
      .getElementById("clear-history-btn")
      .addEventListener("click", function (e) {
        let modal = confirm(
          "Are you sure you want to clear your upload history?"
        );
        if (modal == true) {
          uploads.clearUploads();
          location.reload();
        } else {
          return;
        }
      });
  } else {
    document.getElementById("empty-uploads-message").style.display = "inline";
    //document.getElementById("empty-uploads-message").disabled = true;
  }
});
