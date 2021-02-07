//
//
//INJECT EVERY JS & CSS SCRIPT
//APPEND APP HTML
//
//
const GetUserSlateData = () => {
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
  return get_slates;
};

const GetUserSettings = () => console.log('GetUserSettings');

const StartSlate = () => {
  //GET ALL USER AND PAGE DATA - PASS TO ./core/app.js
  const get_user_data = {
    settings: GetUserSettings(),
    slate: GetUserSlateData(),
  }
  const get_page_data = {
    data: GetPageData(),
    files: GetPageFiles()
  }
  const open = App({ user: get_user_data, page: get_page_data  });
}
