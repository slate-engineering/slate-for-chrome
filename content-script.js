var SlateApp = (function () {
  this.uploadQueueArray = [];
  //set default variables
  function SlateApp() {
    //add variables
  }

  SlateApp.prototype.init = async () => {
    try {
      $.get(chrome.extension.getURL("./app/pages/app.html"), function (data) {
        $(data).prependTo("body");
      })
        .done(function () {
          document
            .getElementById("slate-upload-btn")
            .addEventListener("click", function () {
              chrome.runtime.sendMessage({ uploadData: "slate" });
            });
          document
            .getElementById("slate-close-icon")
            .addEventListener("click", function () {
              location.reload();
            });
          return true;
        })
        .fail(function () {
          return false;
        });
      return true;
    } catch (error) {
      console.error(error);
    }
  };

  SlateApp.prototype.getPageFiles = async () => {
    var allFiles = [];
    var filesArray = [];
    var fetchImages = $("body")
      .find("img")
      .map(function () {
        return this;
      })
      .get();
    Array.prototype.map.call(fetchImages, function (i) {
      allFiles.push(i);
    });
    var position = 0;
    for (var i = 0; i < allFiles.length; i++) {
      position++;
      const id = position;
      const type = "img";
      if (allFiles[i].naturalWidth > 100) {
        filesArray.push({
          id: id,
          src: allFiles[i].src,
          altTitle: allFiles[i].alt || null,
          type: type,
          page_position: position,
          width: allFiles[i].naturalwidth,
          height: allFiles[i].naturalHeight,
        });
      }
    }
    return filesArray;
  };

  SlateApp.prototype.listFiles = async (files) => {
    try {
      $.getScript(chrome.extension.getURL("./app/index.js"), function (data) {
        $(data).append("body");
      })
        .done(function () {
          console.log("index added");
          files.forEach(function (item) {
            var div = document.createElement("div");
            div.className = "slate-img-container slate-masonry-item";
            var img = document.createElement("img");
            img.className = "slate-list_img";
            img.id = "img-" + item.id;
            if (item.type == "img") {
              img.src = item.src;
            }

            var checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.value = item.src;
            checkbox.id = "check-" + item.id;
            checkbox.className = "slate-img-checkbox";

            let customCheckbox = document.createElement("div");
            customCheckbox.className = "slate-custom-checkbox";
            customCheckbox.innerHTML =
              '<svg class="slate-custom-checkbox-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

            div.onclick = async () => {
              this.uploadQueueArray.push({ item });
              console.log("Img added: ", this.uploadQueueArray);
              let customCheckIcon = customCheckbox.childNodes[0];
              if (!checkbox.checked) {
                checkbox.checked = true;
                customCheckbox.className = "slate-custom-checkbox checked";
                customCheckIcon.classList.add("checked");
                img.classList.add("selected");
                div.classList.add("selected");
              } else {
                checkbox.checked = false;
                customCheckbox.className = "slate-custom-checkbox";
                customCheckIcon.classList.remove("checked");
                img.classList.remove("selected");
                div.classList.remove("selected");
              }
              //await SelectFile(item);
            };

            div.appendChild(checkbox);
            div.appendChild(img);
            div.appendChild(customCheckbox);
            document.getElementById("slate-image-grid").appendChild(div);
          });
          return true;
        })
        .fail(function () {
          return false;
        });
      return true;
    } catch (error) {
      console.error(error);
    }
  };

  SlateApp.prototype.getApiKeys = async () => {
    // Add chrome local storage get for all api keys
    let keys = [];
    chrome.storage.local.get(["apis"], (result) => {
      for (let api of result.apis) keys.push(api);
    });
    return keys;
  };

  return SlateApp;
})();

var app = new SlateApp();

chrome.runtime.onMessage.addListener(async function (request, callback) {
  if (request.message == "openSlateApp") {
    let initApp = await app.init();
    let allPageFiles = await app.getPageFiles();
    let initIndex = await app.listFiles(allPageFiles);
  }
});
