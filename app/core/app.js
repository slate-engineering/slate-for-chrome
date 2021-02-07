var upload_queue = [];

const App = ({ user, page }) => {
  console.log(user);
  console.log(page);
  const site = document;
  const app = site.getElementById('slate-app');
  app.style.display = 'inline';
  const file_display = ShowFiles({ files: page.files });
  const list = ShowSlatesList({ slates: user.slate });
}

const SelectFile = ({ image }) => {
  console.log('IMAGE::::', image)
  const app = document;
  app.getElementById("img-" + image.id).addClass = "selected";
  upload_queue.push({
    id: image.id,
    src: image.src,
    title: image.alt || 'none'
  });
  if(upload_queue.length == 1) {
    app.getElementById('title').innerHTML = 'Add ' + upload_queue.length + ' file to slate';
  }else{
    app.getElementById('title').innerHTML = 'Add ' + upload_queue.length + ' files to slate';

  }
  console.log(upload_queue);
  return upload_queue;
}


const ShowFiles = ({ files }) => {
  console.log('FILES::', files);
var img_array = []
img_array = files;
document.getElementById("image_grid").innerHTML = "";
//document.getElementById("num_results").innerHTML = img_array.length;

files.forEach(function(item) {
  var div = document.createElement("div");
  div.className = "img_container item";
  var img = document.createElement("img");
  if(item.type == 'audio'){
    img.src = 'https://www.tgcstore.net/images/audio-thumbnail.jpg';
  }
  if(item.type == 'video'){
    img.src = 'https://kucumberskinlounge.com/app/themes/kucumber-skin-lounge/dist/images/default-thumb.jpg';
  }
  if(item.type == 'image'){
    img.src = item.src;
  }
  img.className = "list_img";
  img.id = "img-" + item.id;

  var checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.value = item.src;
  checkbox.id = "check-" + item.id;
  checkbox.className = "img_checkbox"

  img.onclick = function() {
    console.log('ITEM IN IMG CLICK', item)
    SelectFile({ image: item });
    checkbox.checked = true;
  };

  checkbox.onclick = function() {
    console.log('ITEM IN CB CLICK', item)
    SelectFile({ image: item });
  };

  div.setAttribute('click', function() {
    document.getElementById('check-' + item.id).checked = true;
    document.getElementById('num_selected').innerHTML = files;
  })

  div.appendChild(checkbox);
  div.appendChild(img);
  document.getElementById("image_grid").appendChild(div);
});
}


const ShowSlatesList = ({ slates }) => {
  console.log('SLATES::::', slates);
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
