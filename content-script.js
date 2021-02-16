$(document).ready(function() {
  $.get(chrome.extension.getURL('./app/pages/app.html'), function(data) {
    $(data).prependTo('body');
  });
  //Wait for message from 'background.js'
  //When message is recieved, inject the Slate App into the current tab
  chrome.runtime.onMessage.addListener(

    async function(request, callback) {
      if (request.message == "clicked_browser_action"){
        let allPageFiles = await GetPageFiles();
        var appMain = document.getElementById('slate-app')
        var imageGrid = document.getElementById("slate-image-grid")
        var img_array = []
        //Required format for arrays in Chrome Extensions
        img_array = Array.from(allPageFiles);
        var imageGrid = ListFiles(img_array)
        appMain.style.display = 'inline'

      }
    }
  );

});
