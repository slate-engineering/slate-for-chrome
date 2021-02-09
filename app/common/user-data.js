const GetUserSettings = () => {
  //LDB settings -> get all
  console.log('returns user settings')
}

const GetUserApiKeys = () => {
  //LDB api_keys -> get all
  console.log('returns user api keys')
}

const GetUserSlates = () => {
  //LDB slates -> get all -> group by api key;
  //foreach api_keys -> get all slates -> create array and group by api key
  console.log('returns my slates')
}

const RefreshSlates = () => {
  //API fetch slates -> update LDB -> group by api key;
  console.log('refreshed slates')
}
