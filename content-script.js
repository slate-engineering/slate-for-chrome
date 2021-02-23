$(document).ready(function () {
  $.get(chrome.extension.getURL("./app/pages/app.html"), function (data) {
    $(data).prependTo("body");
  });
  //Wait for message from 'background.js'
  //When message is recieved, inject the Slate App into the current tab
  chrome.runtime.onMessage.addListener(async function (request, callback) {
    if (request.message == "clicked_browser_action") {
      let allPageFiles = await GetPageFiles();
      let appMain = document.getElementById("slate-app");
      let imageGrid = document.getElementById("slate-image-grid");
      //Required format for arrays in Chrome Extensions
      let imageArray = Array.from(allPageFiles);
      await ListFiles(imageArray);
      appMain.style.display = "inline";

      document
        .getElementById("slate-file-search")
        .addEventListener("input", async () => {
          let search = [];
          let term = document.getElementById("slate-file-search").value;
          imageArray.filter(function (img) {
            if (img.altTitle) {
              if (img.altTitle.includes(term)) {
                search.push({ e });
              } else {
              }
            } else {
              console.log("empty");
            }
          });
          await SearchFiles(search);
        });

      document
        .getElementById("slate-upload-btn")
        .addEventListener("click", async () => {
          document.getElementById("slate-app").style.display = "none";
          chrome.runtime.sendMessage({ message: "upload_to_slate" }, function (
            response
          ) {
            console.log(response);
          });
        });

      document
        .getElementById("slate-close-icon")
        .addEventListener("click", function () {
          //TODO (JASON) Clear arrays onclose
          document.getElementById("slate-app").style.display = "none";
        });

      var elements = document.getElementsByClassName("slate-img-container");
      var number = 0;
      var myFunction = () => {
        number++;
        if (number == 1) {
          document.getElementById("slate-popup-title-name").innerHTML =
            "Upload 1 image to Slate";
        } else {
          document.getElementById("slate-popup-title-name").innerHTML =
            "Upload " + number + " images to Slate";
        }
      };

      for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", myFunction, false);
      }
    }
  });
});

SearchFiles = async (files) => {
  document.getElementById("slate-image-grid").innerHTML = "";
  if (files.length == 0) {
    document.getElementById("slate-image-grid").innerHTML = "No results found";
  } else {
    files.forEach(function (item) {
      let div = document.createElement("div");
      div.className = "slate-img-container slate-masonry-item";
      let img = document.createElement("img");
      img.className = "list_img";
      img.id = "img-" + item.id;
      img.src = item.e.src;

      let checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.value = item.src;
      checkbox.id = "check-" + item.id;
      checkbox.className = "slate-img-checkbox";

      let customCheckbox = document.createElement("div");
      customCheckbox.className = "custom-checkbox";
      customCheckbox.innerHTML =
        '<svg class="custom-checkbox-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';

      checkbox.onclick = async function () {
        await SelectFile(item);
      };

      div.onclick = async () => {
        let customCheckIcon = customCheckbox.childNodes[0];
        if (!checkbox.checked) {
          checkbox.checked = true;
          customCheckbox.className = "custom-checkbox checked";
          customCheckIcon.classList.add("checked");
          img.classList.add("selected");
          div.classList.add("selected");
        } else {
          checkbox.checked = false;
          customCheckbox.className = "custom-checkbox";
          customCheckIcon.classList.remove("checked");
          img.classList.remove("selected");
          div.classList.remove("selected");
        }
        //return SelectFile({ image: item });
        await SelectFile({ image: item });
      };

      div.appendChild(checkbox);
      div.appendChild(img);
      div.appendChild(customCheckbox);
      document.getElementById("slate-image-grid").appendChild(div);
    });
  }
  return;
};
