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
  var allFiles = [];
  var filesArray = [];
  var fetchImages = $("body").find("img").map(function() { return this; }).get();
  Array.prototype.map.call(fetchImages, function (i) {
    allFiles.push(i)
  });
  var position = 0;
  for (var i = 0; i < allFiles.length; i++) {
      position++;
      const id = position;
      const type = 'img'
      if(allFiles[i].naturalWidth > 100) {
        filesArray.push({
          id: id,
          src: allFiles[i].src,
          altTitle: allFiles[i].alt || null,
          type: type,
          page_position: position,
          width: allFiles[i].naturalwidth,
          height: allFiles[i].naturalHeight
        });
      }
  }
  console.log('Page files: ',filesArray)
  return filesArray;
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
