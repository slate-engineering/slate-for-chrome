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
  var all_files = [];
  var new_all_files = [];
  Array.prototype.map.call(document.images, function (i) {
    all_files.push(i)
  });
  var position = 0;
  console.log(all_files)

  for (var i = 0; i < all_files.length; i++) {
      position++;
      var id = "123";
      //var ext = all_files[i].src.split('.').pop()
      const type = 'img'
      //const type = GetFileType({ ext: ext});

      new_all_files.push({
        id: id,
        src: all_files[i].src,
        type: type,
        page_position: position,
      });
  }
  console.log('PAGE-DATE FILE:', new_all_files)
  return new_all_files;
};
