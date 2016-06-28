// ==UserScript==
// @name         Turn on Offer tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8080/financial-product/personal-loan
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var offerTab = $('a[href="#products"][role="tab"]');
    console.log('offerTab: ', offerTab);
    if (offerTab.length > 0)
    	offerTab.css('pointer-events', 'auto');
    // Your code here...
})();
