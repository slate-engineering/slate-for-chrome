var upload_queue = [];

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
    app.getElementById('slate-popup-title').innerHTML = 'Add ' + upload_queue.length + ' file to slate';
  }else{
    app.getElementById('slate-popup-title').innerHTML = 'Add ' + upload_queue.length + ' files to slate';
  }
  console.log(upload_queue);
  return upload_queue;
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
