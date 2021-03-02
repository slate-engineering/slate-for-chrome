var Uploads = function () {
  this.uploadData = [];
};

Uploads.prototype.getUploads = () => {
  chrome.storage.local.get(["uploads"], function (result) {
    this.uploads.uploadData = result.uploads;
    console.log(this.uploads.uploadData);
  });
  return this.uploads.uploadData;
};

Uploads.prototype.showUploads = (upload, filetype) => {
  let uploadTable = document.getElementById("slate-uploads");
  let uploadEntries = document.createElement("div");
  let fileTypeIcon = document.createElement("div");
  fileTypeIcon.className = "slate-icon";
  if (filetype.startsWith("image/")) {
    fileTypeIcon.innerHTML = '<object class="slate-icon" type="image/svg+xml" data="../common/svg/image.svg"></object>';
  }
  console.log(fileTypeIcon);
  uploadEntries.className = "slate-table-row";
  uploadEntries.innerHTML = upload
    .map((uploadInfo, i) =>
      i === 0
        ? '<div class="slate-link-column">' + fileTypeIcon + "<div>" + uploadInfo + "</div>" + "</div>"
        : i === 2
        ? '<div class="slate-link-column">' +
          '<object class="slate-icon" type="image/svg+xml" data="../common/svg/eye.svg"></object>' +
          '<div class="slate-link-info">' +
          uploadInfo +
          "</div>" +
          "</div>"
        : '<div class="slate-column-width">' + uploadInfo + "</div>"
    )
    .join("");
  uploadTable.appendChild(uploadEntries);
};

var uploads = new Uploads();

document.addEventListener("DOMContentLoaded", async () => {
  let existingUploads = await uploads.getUploads();
  console.log(existingUploads);

  //TODO (@Tara/@Jason) fake data, to be deleted later
  let fakeUploads = [
    {
      name: "jim-dark-secrets.png",
      type: "image/jpeg",
      source: "https://www.criterion.com/shop/collection/169-wes-anderson",
      cid: "a238149phsdfaklsjdfhlqw48rlfsad",
      date: "2020-10-13T19:49:41.036Z",
      url: "https://slate.textile.io/ipfs/bafkreiepfcul4ortkdvxkqe4hfbulggzvlcijkr3mgzfhnbbrcgwlykvxu",
      uploading: false,
    },
    {
      name: "jim-dark-secrets.png",
      type: "image/jpeg",
      source: "https://www.criterion.com/shop/collection/169-wes-anderson",
      cid: "a238149phsdfaklsjdfhlqw48rlfsad",
      date: "2020-10-13T19:49:41.036Z",
      url: "https://slate.textile.io/ipfs/bafkreiepfcul4ortkdvxkqe4hfbulggzvlcijkr3mgzfhnbbrcgwlykvxu",
      uploading: false,
    },
    {
      name: "jim-dark-secrets.png",
      type: "image/jpeg",
      source: "https://www.criterion.com/shop/collection/169-wes-anderson",
      cid: "a238149phsdfaklsjdfhlqw48rlfsad",
      date: "2020-10-13T19:49:41.036Z",
      url: "https://slate.textile.io/ipfs/bafkreiepfcul4ortkdvxkqe4hfbulggzvlcijkr3mgzfhnbbrcgwlykvxu",
      uploading: false,
    },
  ];

  fakeUploads.forEach((upload) => {
    console.log(upload);
    uploadInfo = [upload.name, upload.date, upload.source];
    uploads.showUploads(uploadInfo, upload.type);
  });
});
