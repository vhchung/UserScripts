// ==UserScript==
// @name         Turn on Offer tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://localhost:8080/financial-product/personal-loan
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var offerTab = document.querySelector('a[href="#products"][role="tab"]');
    console.log('offerTab: ', offerTab);
    if (offerTab.length > 0) {
    	offerTab.style.pointerEvents = "all";
    }
    // Your code here...
})();
