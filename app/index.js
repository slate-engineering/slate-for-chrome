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

function GetPageFiles() {
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
