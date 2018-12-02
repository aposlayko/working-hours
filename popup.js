document.addEventListener('DOMContentLoaded', function() {
  var resultsElement = document.getElementById('results');
  var getInfoButton = document.getElementById('get-info');

  function sendMessageToContent() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'get-info'});
    });
  }

  getInfoButton.addEventListener('click', function () {
    sendMessageToContent();
  });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'send-html') {
      console.log(request.data);
    }
  });

  chrome.tabs.executeScript({
    file: 'content.js'
  });

}, false);