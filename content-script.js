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
        var imageArray = []
        //Required format for arrays in Chrome Extensions
        imageArray = Array.from(allPageFiles);
        var imageGrid = await ListFiles(imageArray)
        console.log('ids: ', imageGrid)
        idArray = Array.from(imageGrid);
        //var buildUpload = await ListFiles(imageArray);
        appMain.style.display = 'inline'

        document.getElementById('slate-file-search').addEventListener("input", async () => {
          let search = []
          let term = document.getElementById('slate-file-search').value;
          let bigCities = imageArray.filter(function (e) {
            console.log('from search', e)
            if(e.altTitle){
              console.log('no empty')
              if(e.altTitle.includes(term)){
                search.push({ e })
              }else{
              }
            }else{
              console.log('empty')
            }
          });
          var imageSearch = await SearchFiles(search)
          console.log('search results', search)
        });

        document.getElementById('slate-upload-btn').addEventListener("click", async () => {
          document.getElementById('slate-app').style.display = 'none'
          chrome.runtime.sendMessage({ message: "upload_to_slate"}, function(response) {
            console.log(response);
          });
        });

        document.getElementById('slate-close-icon').addEventListener("click", async () => {
          document.getElementById('slate-app').style.display = 'none'
        });

        var elements = document.getElementsByClassName("slate-img-container");
        var number = 0;
        var myFunction = function() {
            number++
            if (number == 1) {
              document.getElementById("slate-popup-title-name").innerHTML = 'Upload 1 image to Slate';
            }else{
              document.getElementById("slate-popup-title-name").innerHTML = 'Upload ' + number + ' images to Slate';
            }
        };

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', myFunction, false);
        }

      }
    }
  );
});

let SearchFiles = async (files) => {
  document.getElementById("slate-image-grid").innerHTML = ""
  if(files.length == 0){
    document.getElementById("slate-image-grid").innerHTML = "No results found"
  }else{
    files.forEach(function(item) {
      var div = document.createElement("div");
      div.className = "slate-img-container slate-masonry-item";
      var img = document.createElement("img");
      img.className = "list_img";
      img.id = "img-" + item.id;
      idArray.push({ id: img.id })
      img.src = item.e.src;

      img.onclick = async () => {
        if(!checkbox.checked) {
          checkbox.checked = true
        }else{
          checkbox.checked = false
        }
        //return SelectFile({ image: item });
        let imgClick = await SelectFile({ image: item });
      }

      var checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.value = item.src;
      checkbox.id = "check-" + item.id;
      checkbox.className = "slate-img-checkbox"

      checkbox.onclick = async function() {
        let checkClick = await SelectFile({ image: item });
      };

      div.appendChild(checkbox);
      div.appendChild(img);
      document.getElementById("slate-image-grid").appendChild(div);
    });
  }
  return;
}
