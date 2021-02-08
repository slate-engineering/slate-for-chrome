//
//
//Get user Slate data from ''/core/api'
const GetUserSlateData = async () => {
  const api = [
    { key: '1', name: 'fun stuff' },
    { key: '2', name: 'design' },
    { key: '3', name: 'personal' },
  ]
  const get_slates = [
    { name: 'my slate one', id: '1', api: '2' },
    { name: 'two', id: '2', api: '1' },
    { name: 'design stuff', id: '3', api_key: '1' }
  ]
  console.log(get_slates)
  return get_slates;
};
//
//
//Get user Slate data from ''/core/user-date'
const GetUserSettings = async () => console.log('GetUserSettings');

const GetPageData = () => {
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
  const all_files = document.querySelectorAll('img,audio,video')
  var all_files_array = [];
  var position = 0;

  for (var i = 0; i < all_files.length; i++) {
      position++;
      var id = "123";
      var ext = all_files[i].currentSrc.split('.').pop()
      const type = 'img'
      //const type = GetFileType({ ext: ext});

      all_files_array.push({
        id: id,
        src: all_files[i].currentSrc,
        alt: all_files[i].alt,
        type: type,
        page_position: position,
        width: all_files[i].width,
        height: Math.floor(Math.random() * 2000)
      });
  }
  console.log('PAGE-DATE FILE:', all_files_array)
  return all_files_array;
};

const ShowFilesMain = ({ files }) => {
  console.log('FILES::', files);
  var img_array = []
  img_array = files;
  //document.getElementById("image_grid").innerHTML = "";
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
    document.getElementById("page_images").appendChild(div);
  });
}


//
//
//Listen for message that the Slate icon was clicked
//Once the message is received, StartSlate()
chrome.runtime.onMessage.addListener(
   async function(request, sender, sendResponse) {
      if(request.message === "clicked_browser_action") {
        let mySlateSettings = await GetUserSettings()
        let mySlateSlate = await GetUserSlateData()
        let myPageData = GetPageData()
        let myPageFiles = GetPageFiles()
        const get_user_data = {
          settings: mySlateSettings,
          slate: mySlateSlate
        }
        //
        const get_page_data = {
          data: myPageData,
          files: myPageFiles
        }

        const site = document;

        const app = site.getElementById('slate-app');
        //app.style.display = 'inline';
        const file_display = ShowFilesMain({ files: get_page_data.files });
        const list = ShowSlatesList({ slates: get_user_data.slate });
      }
   }
);
