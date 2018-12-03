document.addEventListener('DOMContentLoaded', function () {
  var VISIT_HISTORY_URL = '/site/visits-history-popup';
  var resultsElement = document.getElementById('results');
  var getInfoButton = document.getElementById('get-info');

  console.log('popup here');

  function sendMessageToContent() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      console.log(tabs);
      chrome.tabs.sendMessage(tabs[0].id, {type: 'get-info', data: VISIT_HISTORY_URL});
    });
  }

  function calculateBalance(dom) {
    let data = [];
    const currentMounth = (new Date()).getMonth();

    let visitHistoryElement = dom.querySelector('.tabContent.jsVisitsHistory');
    if (!visitHistoryElement) {
      return null;
    }

    visitHistoryElement.querySelectorAll('.table tbody tr').forEach((tr) => {
      const date = new Date(...tr.querySelector(':nth-child(2)').innerHTML.split('.').map((string, index) => index === 1 ? Number(string) - 1 : Number(string)).reverse());
      const minutes = tr.querySelector(':nth-child(6)').innerHTML.split(':').reduce((accumulator, currentValue, index) => {
        return Number(accumulator) * 60 + Number(currentValue);
      });
      data.push([date, minutes]);
    });

    const cleanData = data
      .filter((item) => item[0].getMonth() === currentMounth)
      .filter((item) => !!item[1]);

    return (cleanData.map((value) => value[1]).reduce((accumulator, currentValue) => accumulator + currentValue) - cleanData.length * 8 * 60) / 60;
  }

  function displayResult(result) {
    resultsElement.innerHTML = result;
  }

  getInfoButton.addEventListener('click', function () {
    sendMessageToContent();
  });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'send-html') {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = request.data;

      displayResult((calculateBalance(wrapper)));
    }
  });

  /*chrome.tabs.executeScript({
    file: 'content.js'
  });*/

}, false);