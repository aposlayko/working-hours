console.log('content here');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'get-info') {
    fetchData(request.data).then(function (html) {
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
  }).catch(function (err) {
    console.error(err)
  });
}

function sendMessageToPopup(data) {
  console.log(data);
  chrome.runtime.sendMessage({type: 'send-html', data: data});
}