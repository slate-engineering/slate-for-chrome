add_APIKey = () => {
  var APIInput = document.getElementById("api-keys");
  var newAPIInput = document.createElement("div");
  newAPIInput.innerHTML =
    '<div class="api-key"><input class="input name" placeholder="Name" /><input class="input key" placeholder="XXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX" /></div>';
  APIInput.appendChild(newAPIInput);
};
