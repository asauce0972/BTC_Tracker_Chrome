/**
 * Declare initial variables
 */
let price = marketcap = high = low = percentage = dailyvolume = '';

/**
 * fetchPrice
 * --------------
 * Fetches price data by emitting message to background.js. Takes the result from emitted message
 * and displays the price in extension.
 */

const fetchPrice = (node) => {
  chrome.runtime.sendMessage({
    action: 'fetch_price'
  }, function(res) {
    price = res;
    node.textContent = res.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  })
};

const fetchMarketCap = (node) => {
  chrome.runtime.sendMessage({
    action: 'fetch_marketcap'
  }, function(res) {
    marketcap = res;
    node.textContent = res.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  })
};

const fetchHigh = (node) => {
  chrome.runtime.sendMessage({
    action: 'fetch_high'
  }, function(res) {
    high = res;
    node.textContent = res.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  })
};

const fetchLow = (node) => {
  chrome.runtime.sendMessage({
    action: 'fetch_low'
  }, function(res) {
    low = res;
    node.textContent = res.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  })
};

const fetchPercentage = (node) => {
  chrome.runtime.sendMessage({
    action: 'fetch_percentage'
  }, function(res) {
    percentage = res;
    node.textContent = (res.toFixed(2))+'%';
    if(res>=0){
      node.style.color = "lightgreen";
    } else {
      node.style.color = "red";
    }
  })
};

const fetchDailyVolume = (node) => {
  chrome.runtime.sendMessage({
    action: 'fetch_dailyvolume'
  }, function(res) {
    dailyvolume = res;
    node.textContent = res.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  })
};

/**
 * listenForPrice
 * --------------
 * Adds a listener for price messages sent from background.js, and updates price in extension
 */
const listenForPrice = (node) => {
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === 'send_price') {
      price = msg.msg;
      node.textContent = msg.msg.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  });
};

const listenForMarketCap = (node) => {
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === 'send_marketcap') {
      marketcap = msg.msg;
      node.textContent = msg.msg.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  });
};

const listenForHigh = (node) => {
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === 'send_high') {
      high = msg.msg;
      node.textContent = msg.msg.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  });
};

const listenForLow = (node) => {
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === 'send_low') {
      low = msg.msg;
      node.textContent = msg.msg.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  });
};

const listenForPercentage = (node) => {
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === 'send_percentage') {
      percentage = msg.msg;
      node.textContent = (msg.msg.toFixed(2))+'%';
      if(msg.msg>=0){
        node.style.color = "lightgreen";
      } else {
        node.style.color = "lightred";
      }
    }
  });
};

const listenForDailyVolume = (node) => {
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if (msg.action === 'send_dailyvolume') {
      dailyvolume = msg.msg;
      node.textContent = msg.msg.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  });
};

/**
 * initPrices
 * ----------
 * Emit message to background.js to fetch current price data.
 * First: Immediately fetches price data, so that the price data is immediately requested.
 * Second: Adds a listener for messages emitted from background.js with updated price data.
 */
const initPrices = () => {
  const Node = document.getElementById('price-num');
  fetchPrice(Node);
  listenForPrice(Node);
};

const initMarketCap = () => {
  const Node = document.getElementById('mrkt-num');
  fetchMarketCap(Node);
  listenForMarketCap(Node);
};

const initHigh = () => {
  const Node = document.getElementById('high-num');
  fetchHigh(Node);
  listenForHigh(Node);
};

const initLow = () => {
  const Node = document.getElementById('low-num');
  fetchLow(Node);
  listenForLow(Node);
};

const initPercentage = () => {
  const Node = document.getElementById('percentage');
  fetchPercentage(Node);
  listenForPercentage(Node);
};

const initDailyVolume = () => {
  const Node = document.getElementById('dvol-num');
  fetchDailyVolume(Node);
  listenForDailyVolume(Node);
};

/**
 * Invoke all necessary functions once DOM is loaded
 */
window.addEventListener('DOMContentLoaded', function () {
  // Fetch current btc data from coingecko
  initPrices();
  initMarketCap();
  initHigh();
  initLow();
  initPercentage();
  initDailyVolume();
});
