/*
 index.js
 Copyright 2015 AppFeel. All rights reserved.
 http://www.appfeel.com
 
 AdMobAds Cordova Plugin (cordova-admob)
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to
 deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var app = {
    // global vars
    admobReady: false,
    autoShowInterstitial: false,
    progressDialog: document.getElementById("progressDialog"),
    spinner: document.getElementById("spinner"),
    weinre: {
        enabled: false,
        ip: '', // ex. http://192.168.1.13
        port: '', // ex. 9090
        targetApp: '' // ex. see weinre docs
    },

    // Application Constructor
    initialize: function () {
        console.log('initialize()');
        if ((/(ipad|iphone|ipod|android)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', app.onDeviceReady, false);
        } else {
            app.onDeviceReady();
        }
    },
    // Must be called when deviceready is fired so AdMobAds plugin will be ready
    initAds: function () {
        console.log('initAds()');
        app.setOptions();
    },
    // Bind Event Listeners
    bindAdEvents: function () {
        console.log('bindAdEvents()');
        if (window.admob) {
            document.addEventListener("orientationchange", this.onOrientationChange, false);
            document.addEventListener(admob.events.onAdLoaded, this.onAdLoaded, false);
            document.addEventListener(admob.events.onAdFailedToLoad, this.onAdFailedToLoad, false);
            document.addEventListener(admob.events.onAdOpened, function (e) { }, false);
            document.addEventListener(admob.events.onAdClosed, function (e) { }, false);
            document.addEventListener(admob.events.onAdLeftApplication, function (e) { }, false);
            // document.addEventListener(admob.events.onInAppPurchaseRequested, function (e) { }, false);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },

    // -----------------------------------
    // Events.
    // The scope of 'this' is the event.
    // -----------------------------------
    onOrientationChange: function () {
        console.log('onOrientationChange()');
        app.onResize();
    },
    onDeviceReady: function () {
        console.log('onDeviceReady()');
        var weinre,
            weinreUrl;

        document.removeEventListener('deviceready', app.onDeviceReady, false);

        if (app.weinre.enabled) {
            console.log('Loading weinre...');
            weinre = document.createElement('script');
            weinreUrl = app.weinre.ip + ":" + app.weinre.port;
            weinreUrl += '/target/target-script-min.js';
            weinreUrl += '#' + app.weinre.targetApp;
            weinre.setAttribute('src', weinreUrl);
            document.head.appendChild(weinre);
        }

        if (window.admob) {
            console.log('Binding ad events...');
            app.bindAdEvents();
            console.log('Initializing ads...');
            app.initAds();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    onAdLoaded: function (e) {
        console.log('onAdLoaded()', JSON.stringify({ adType: e.adType, adapter: e.adapter }));
        app.showProgress(false);
        if (window.admob && e.adType === window.admob.AD_TYPE.INTERSTITIAL) {
            if (app.autoShowInterstitial) {
                window.admob.showInterstitialAd();
            } else {
                alert("Interstitial from " + e.adapter + " is available. Click on 'Show Interstitial' to show it.");
            }
        }
    },
    onAdFailedToLoad: function (e) {
        console.log('onAdFailedToLoad()');
        app.showProgress(false);
        alert("Could not load ad: " + JSON.stringify(e));
    },
    onResize: function () {
        console.log('onResize()');
        var msg = 'Web view size: ' + window.innerWidth + ' x ' + window.innerHeight;
        document.getElementById('sizeinfo').innerHTML = msg;
    },

    // -----------------------------------
    // App buttons functionality
    // -----------------------------------
    startBannerAds: function () {
        if (app.admobReady) {
            app.showProgress(true);
            window.admob.createBannerView(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    removeBannerAds: function () {
        if (app.admobReady) {
            app.showProgress(false);
            window.admob.destroyBannerView();
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showBannerAds: function () {
        if (app.admobReady) {
            app.showProgress(false);
            window.admob.showBannerAd(true, function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    hideBannerAds: function () {
        if (app.admobReady) {
            app.showProgress(false);
            window.admob.showBannerAd(false);
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    requestInterstitial: function (autoshow) {
        if (app.admobReady) {
            app.showProgress(true);
            app.autoShowInterstitial = autoshow;
            window.admob.requestInterstitialAd(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showInterstitial: function () {
        if (app.admobReady) {
            app.showProgress(false);
            window.admob.showInterstitialAd(function () { }, function (e) {
                alert(JSON.stringify(e));
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
    showProgress: function (show) {
        if (show) {
            addClass(app.spinner, "animated");
            removeClass(app.progressDialog, "hidden");
        } else {
            addClass(app.progressDialog, "hidden");
            removeClass(app.spinner, "animated");
        }
    },
    setOptions: function () {
        var isAndroid = (/(android)/i.test(navigator.userAgent));
        var adUnits = {
            ios: {
                banner: 'ca-app-pub-8736727451487566/8579007020',
                interstitial: 'ca-app-pub-8736727451487566/6962673020'
            },
            android: {
                // banner: 'ca-app-pub-3940256099942544/6300978111', // test banner
                banner: 'ca-app-pub-8736727451487566/8260142860', // bbo banner with mediation
                interstitial: 'ca-app-pub-3940256099942544/1033173712' // test interstitial
            }
        };
        var admobid;
        if (isAndroid) {
            admobid = adUnits.android;
        } else {
            admobid = adUnits.ios;
        }
        if (window.admob) {
            admob.setOptions({
                publisherId: admobid.banner,
                interstitialAdId: admobid.interstitial,
                bannerAtTop: true, // set to true, to put banner at top
                overlap: false, // set to true, to allow banner overlap webview
                offsetStatusBar: true, // set to true to avoid ios7 status bar overlap
                // isTesting: true, // receiving test ads (do not test with real ads as your account will be banned)
                autoShowBanner: false, // auto show banners ad when loaded
                autoShowInterstitial: false, // auto show interstitials ad when loaded
                mopubAdUnitId: '23ac5475897343f5a1bf4b04fb53e86f',
            }, function() {
              console.log('admob ready');
              app.admobReady = true;
            });
        } else {
            alert('cordova-admob plugin not ready.\nAre you in a desktop browser? It won\'t work...');
        }
    },
};

function removeClass(elem, cls) {
    var str;
    do {
        str = " " + elem.className + " ";
        elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
    } while (str.match(cls));
}

function addClass(elem, cls) {
    elem.className += (" " + cls);
}
