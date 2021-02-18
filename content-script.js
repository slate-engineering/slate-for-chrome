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
          console.log('term:', term)
          let bigCities = imageArray.filter(function (e) {
            console.log('from search', e)
            if(e.altTitle){
              console.log('no empty')
              if(e.altTitle.includes(term)){
                console.log('yes it includes woman')
                search.push({ e })
              }else{
                console.log('no it does not include woman')
              }
            }else{
              console.log('empty')
            }
          });
          var imageSearch = await SearchFiles(search)
          console.log('search results', search)
        });

        document.getElementById('slate-upload-btn').addEventListener("click", async () => {
          alert('upload!')
        });

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


      var checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.value = item.src;
      checkbox.id = "check-" + item.id;
      checkbox.className = "slate-img-checkbox"

      div.appendChild(checkbox);
      div.appendChild(img);
      document.getElementById("slate-image-grid").appendChild(div);
    });
  }
  return;
}
