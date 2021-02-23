var uploadQueue = [];

function GetPageData() {
  const page = document;
  const site = window.location;
  const data = {
    title: page.title,
    url: site.href,
    base_url: site.host,
  };
  return data;
}

const GetPageFiles = () => {
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
  console.log("Page files: ", filesArray);
  return filesArray;
};

ListFiles = async (files) => {
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

    checkbox.onclick = async function () {
      await SelectFile({ image: item });
    };

    div.onclick = async () => {
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
      await SelectFile({ image: item });
    };

    div.appendChild(checkbox);
    div.appendChild(img);
    div.appendChild(customCheckbox);
    document.getElementById("slate-image-grid").appendChild(div);
  });
  return;
};

ShowSlatesList = ({ slates }) => {
  const list = document.getElementById("list-slates");
  slates.forEach(
    (slate) =>
      function () {
        console.log("name", slate.name);
        var div = document.createElement("div");
        div.className = "slate-api-group";

        var div2 = document.createElement("div");
        div2.className = "slate-item";
        div2.innerHTML = slate.name;

        div.append(div2);
        list.append(div);
      }
  );
};

SelectFile = async ({ image }) => {
  uploadQueue.push({
    id: image.id,
    src: image.src,
    title: image.alt || null,
  });
  return uploadQueue;
};
