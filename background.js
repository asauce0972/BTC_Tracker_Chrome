/**
 * Declare initial variables
 */
const xhr = new XMLHttpRequest();
let amt = marketcap = high = low = percentage = dailyvolume = 0;

/**
 * All data about BTC price comes from Coingecko API.
 */
const COINGECKO_BTC_PRICE_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_desc&per_page=100&page=1&sparkline=false"

function kFormatter(num) {
  if (num <= 9) return num.toFixed(2);
  else if (num <= 99) return num.toFixed(2);
  else if (num <= 999) return num.toFixed(1);
  else if (num <= 9999) return ((num/1000).toFixed(2)) + 'K';
  else if (num <= 99999) return ((num/1000).toFixed(1)) + 'K';
  else if (num <= 999999) return ((num/1000).toFixed(0)) + 'K';
  else if (num <= 9999999) return ((num/1000000).toFixed(2)) + 'M';
  else if (num <= 99999999) return ((num/1000000).toFixed(1)) + 'M';
  else if (num <= 999999999) return ((num/1000000).toFixed(0)) + 'M';
  else return 'BTC';
}

/**
 * setBadge
 * --------
 * Sets badge with the current price of BTC.
 */
const setBadge = (amt) => {
  chrome.browserAction.setBadgeText({
    text: kFormatter(amt)
  })
  chrome.browserAction.setBadgeBackgroundColor({
    color: percentage >= 0 ? '#67BD62' : '#DB1522' 
  })
};

/**
 * sendPriceMsg
 * -------------
 * Sends a message from background.js to a listener in popup.js with the current BTC price.
 */
const sendPriceMsg = (amt, marketcap, high, low, percentage, dailyvolume) => {
  chrome.runtime.sendMessage({
    action: 'send_price',
    msg: amt
  },
  {
    action: 'send_marketcap',
    msg: marketcap
  },
  {
    action: 'send_high',
    msg: high
  },
  {
    action: 'send_low',
    msg: low
  },
  {
    action: 'send_percentage',
    msg: percentage
  },
  {
    action: 'send_dailyvolume',
    msg: dailyvolume
  }
  
  );
};

/**
 * fetchPrice
 * ----------
 * Fetches current BTC price from Coingecko API.
 * Sets badge number to price of BTC.
 * Sends price data to popup.js to display in the extension popup.
 */
const fetchPrice = () => {
  xhr.open("GET", COINGECKO_BTC_PRICE_URL, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      const resp = JSON.parse(xhr.responseText);
      const {current_price, market_cap, high_24h, low_24h, total_volume, price_change_percentage_24h } = resp[0];
      amt = current_price;
      marketcap = market_cap;
      high = high_24h;
      low = low_24h;
      percentage = price_change_percentage_24h;
      dailyvolume = total_volume;
      setBadge(current_price);
      sendPriceMsg(current_price);
    }
  }
  xhr.send();
};

/**
 * fetch listener
 * --------------
 * Adds listener for price fetch requests from popup.js.
 */
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (msg.action === 'fetch_price') {
    response(amt);
  }
  else if (msg.action === 'fetch_marketcap') {
    response(marketcap);
  }
  else if (msg.action === 'fetch_high') {
    response(high);
  }
  else if (msg.action === 'fetch_low') {
    response(low);
  }
  else if (msg.action === 'fetch_percentage') {
    response(percentage);
  }
  else if (msg.action === 'fetch_dailyvolume') {
    response(dailyvolume);
  }
});

/**
 * Init
 */
fetchPrice();

/**
 * Poll for prices every 5 seconds.
 */
setInterval(fetchPrice, 5000);
