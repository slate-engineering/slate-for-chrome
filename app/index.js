var uploadQueue = [];

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

const GetPageFiles = () => {
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
      var id = position;
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
  console.log(new_all_files)
  return new_all_files;
};

let ListFiles = async (files) => {
  let idArray = []
  files.forEach(function(item) {
    var div = document.createElement("div");
    div.className = "slate-img-container slate-masonry-item";
    var img = document.createElement("img");
    img.className = "list_img";
    img.id = "img-" + item.id;
    idArray.push({ id: img.id })
    if(item.type == 'img'){
      img.src = item.src;
    }

    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.value = item.src;
    checkbox.id = "check-" + item.id;
    checkbox.className = "slate-img-checkbox"

    div.appendChild(checkbox);
    div.appendChild(img);
    document.getElementById("slate-image-grid").appendChild(div);
  });

  return idArray;
}

const ShowSlatesList = ({ slates }) => {
  const list = document.getElementById("list-slates");
  slates.forEach(slate => function() {
    console.log('name', slate.name);
    var div = document.createElement("div");
    div.className = 'api-group';

    var div2 = document.createElement('div');
    div2.className = 'slate-item'
    div2.innerHTML = slate.name

    div.append(div2);
    list.append(div);
  });
}

SelectFile = async ({ image }) => {
  uploadQueue.push({
    id: image.id,
    src: image.src,
    title: image.alt || null
  });

  if(uploadQueue.length == 0) {
    document.getElementById('slate-popup-title-name').style.display = 'inline'
  }else if(uploadQueue.length == 1){
    document.getElementsByClassName("slate-title-main").innerHTML = 'Add file to slate';
  }else{
    document.getElementById('slate-popup-title-name').innerHTML = 'Add ' + uploadQueue.length + ' files to slate';
  }

  console.log(uploadQueue)
  return uploadQueue;
}
