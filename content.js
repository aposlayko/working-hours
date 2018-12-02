console.log('content here');

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  if (request.type === 'get-info') {
    console.log("something happening from the extension");
    fetchData('/').then(function (html) {
      sendMessageToPopup(html);
    });
  }
});

function fetchData(url) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'text/html');

  return fetch(url, {
    method: 'get',
    headers: myHeaders
  }).then(function (response) {
    return response.text();
  }).catch(function(err) {
    console.log(err)
  });
}

function sendMessageToPopup(data) {
  chrome.runtime.sendMessage({type: 'send-html', data: data});
}