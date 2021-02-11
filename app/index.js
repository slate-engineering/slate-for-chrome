var upload_queue = [];

function GetPageData() {
  const page = document;
  const site = window.location;
  const data = {
    title: page.title,
    url: site.href,
    base_url: site.host
  }
  return data;
};

function GetPageFiles() {
  var all_files = [];
  var new_all_files = [];

  var images = $("body").find("img").map(function() { return this; }).get();
  Array.prototype.map.call(images, function (i) {
    all_files.push(i)
  });
  var position = 0;
  console.log(all_files)

  for (var i = 0; i < all_files.length; i++) {
      position++;
      var id = "123";
      const type = 'img'

      if(all_files[i].naturalWidth > 100) {
        new_all_files.push({
          id: id,
          src: all_files[i].src,
          altTitle: all_files[i].alt || null,
          type: type,
          page_position: position,
          width: all_files[i].naturalwidth,
          height: all_files[i].naturalHeight
        });
      }
  }
  return new_all_files;
};

const ListFiles = (files) => {
  files.forEach(function(item) {
    var div = document.createElement("div");
    div.className = "img_container item";
    var img = document.createElement("img");
    img.className = "list_img";
    img.id = "img-" + item.id;
    if(item.type == 'img'){
      img.src = item.src;
    }

    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.value = item.src;
    checkbox.id = "check-" + item.id;
    checkbox.className = "img_checkbox"

    img.onclick = function() {
      let imgClick = SelectFile({ image: item });
      checkbox.checked = true;
    };

    checkbox.onclick = function() {
      let checkClick = SelectFile({ image: item });
    };

    div.appendChild(checkbox);
    div.appendChild(img);
    document.getElementById("slate-image-grid").appendChild(div);
  });
}
