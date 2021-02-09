function listFiles(files) {
  files.forEach(function(item) {
    console.log('item')
    var div = document.createElement("div");
    div.className = "img_container item";
    var img = document.createElement("img");
    if(item.type == 'audio'){
      img.src = 'https://www.tgcstore.net/images/audio-thumbnail.jpg';
    }
    if(item.type == 'video'){
      img.src = 'https://kucumberskinlounge.com/app/themes/kucumber-skin-lounge/dist/images/default-thumb.jpg';
    }
    if(item.type == 'img'){
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

    div.appendChild(checkbox);
    div.appendChild(img);
    document.getElementById("slate-image-grid").appendChild(div);
  });
}


function InsertHtml() {
  $.get(chrome.extension.getURL('./app/pages/app.html'), function(data) {
    $(data).prependTo('body');
  });
}

$(document).ready(function() {
  InsertHtml();
  //Wait for message from 'background.js'
  //When message is recieved, inject the Slate App into the current tab
  chrome.runtime.onMessage.addListener(
    async function(request, callback) {
      if (request.message == "clicked_browser_action"){
        var filesHello = await GetPageFiles();

        console.log(filesHello)
        var appMain = document.getElementById('slate-app')
        var changeThem = document.getElementById("slate-image-grid")
        console.log('hello from content-script')
        var img_array = []
        //Required for arrays in Chrome Extensions
        img_array = Array.from(filesHello);
        var listThem = listFiles(img_array)
        appMain.style.display = 'inline'
        console.log('IMG ARRAY::', img_array)
        //document.getElementById("num_results").innerHTML = img_array.length;
      }
    }
  );

});
