function listFiles(files) {
  files.forEach(function(item) {
    var div = document.createElement("div");
    div.className = "img_container item";
    var img = document.createElement("img");
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
      SelectFile({ image: item });
      checkbox.checked = true;
    };

    checkbox.onclick = function() {
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
        let allPageFiles = await GetPageFiles();

        var appMain = document.getElementById('slate-app')
        var changeThem = document.getElementById("slate-image-grid")
        var img_array = []
        //Required for arrays in Chrome Extensions
        img_array = Array.from(allPageFiles);
        var listThem = listFiles(img_array)
        appMain.style.display = 'inline'
      }
    }
  );
});
