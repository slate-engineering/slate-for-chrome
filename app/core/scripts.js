const GenerateID = () => Math.random().toString(36).substr(2, 9);

const GetFileType = (ext) => {
  var type;
  if (ext === 'mp4' || ext === 'ogg') {
    type = 'video';
  }else if (ext === 'mp3') {
    type = 'audio';
  }else{
    type = 'image';
  }
  return type;
}
