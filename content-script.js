chrome.runtime.onMessage.addListener(
  function(request, callback) {
    if (request.message == "clicked_browser_action"){
      $.get(chrome.extension.getURL('./app/pages/app.html'), function(data) {
        $(data).prependTo('body');
      });
    }
  }
);
