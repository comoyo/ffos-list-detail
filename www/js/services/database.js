/*global define */
"use strict";
define(['app'], function(app) {
  app.factory('database', function() {

    function parseDate(s) {
      return new Date((s || "").replace(/-/g,"/").replace(/[TZ]/g," "));
    }

    var DB = function() {
      var items = [{
        "id": 1,
        "title": "B2G",
        "description": "Boot to Gecko aims to create a complete, standalone operating system for the open web.",
        "date": parseDate("2014-07-18T19:59:59Z")
      }, {
        "id": 2,
        "title": "b2g-manifest",
        "description": "Repo manifests for building B2G",
        "date": parseDate("2014-07-18T15:17:27Z")
      }, {
        "id": 3,
        "title": "caldav",
        "description": "Calendar Protocols",
        "date": parseDate("2014-04-09T21:09:41Z")
      }, {
        "id": 4,
        "title": "busybox",
        "description": "Fork of git://android.git.linaro.org/platform/external/busybox.git",
        "date": parseDate("2012-03-18T04:16:08Z")
      }, {
        "id": 5,
        "title": "android-device-galaxys2",
        "description": "",
        "date": parseDate("2014-06-09T21:03:57Z")
      }, {
        "id": 6,
        "title": "android-device-otoro",
        "description": "",
        "date": parseDate("2014-06-09T21:03:41Z")
      }, {
        "id": 7,
        "title": "android-device-crespo",
        "description": "Fork of https://android.googlesource.com/device/samsung/crespo glue/gonk-ics/device/samsung/crespo",
        "date": parseDate("2014-06-09T21:04:45Z")
      }, {
        "id": 8,
        "title": "android-device-panda",
        "description": "",
        "date": parseDate("2014-06-09T21:04:39Z")
      }, {
        "id": 9,
        "title": "b2g-toolchains",
        "description": "Prebuilt toolchains for building b2g",
        "date": parseDate("2012-03-25T02:16:01Z")
      }, {
        "id": 10,
        "title": "bleach.js",
        "description": "HTML sanitizer used by the Firefox OS e-mail client",
        "date": parseDate("2014-06-18T04:16:25Z")
      }, {
        "id": 11,
        "title": "android-development",
        "description": "Fork to allow local modifications",
        "date": parseDate("2014-06-09T21:03:46Z")
      }, {
        "id": 12,
        "title": "adb-push",
        "description": "A fork of adb that only pushes",
        "date": parseDate("2012-09-14T19:21:43Z")
      }, {
        "id": 13,
        "title": "android-hardware_legacy",
        "description": "Fork to enable local modifications",
        "date": parseDate("2014-07-11T08:39:44Z")
      }, {
        "id": 14,
        "title": "android-sdk",
        "description": "Fork for local modification",
        "date": parseDate("2014-06-09T21:04:54Z")
      }, {
        "id": 15,
        "title": "codeaurora_kernel_msm",
        "description": "Android MSM kernel from git://codeaurora.org/kernel/msm.git",
        "date": parseDate("2014-07-10T14:48:49Z")
      }, {
        "id": 16,
        "title": "android-device-maguro",
        "description": "Fork of https://android.googlesource.com/device/samsung/maguro",
        "date": parseDate("2014-06-09T21:05:21Z")
      }, {
        "id": 17,
        "title": "android-device-tuna",
        "description": "Fork of https://android.googlesource.com/device/samsung/tuna",
        "date": parseDate("2014-06-09T21:05:11Z")
      }, {
        "id": 18,
        "title": "android-hardware-libhardware",
        "description": "Local fork to enable modifications",
        "date": parseDate("2012-02-14T22:19:55Z")
      }, {
        "id": 19,
        "title": "android-hardware-ril",
        "description": "Fork to enable local modifications",
        "date": parseDate("2012-01-12T10:22:54Z")
      }, {
        "id": 20,
        "title": "android-system-vold",
        "description": "fork to enable local modifications git://android.git.linaro.org/platform/system/vold.git",
        "date": parseDate("2012-02-06T03:59:51Z")
      }, {
        "id": 21,
        "title": "android_system_bluetooth",
        "description": "",
        "date": parseDate("2011-12-25T05:55:15Z")
      }, {
        "id": 22,
        "title": "device-flame",
        "description": "",
        "date": parseDate("2014-07-11T21:29:58Z")
      }, {
        "id": 23,
        "title": "android-device-crespo4g",
        "description": "Fork of https://android.googlesource.com/device/samsung/crespo4g",
        "date": parseDate("2014-06-09T21:06:25Z")
      }, {
        "id": 24,
        "title": "android-device-hamachi",
        "description": "",
        "date": parseDate("2014-06-09T21:04:22Z")
      }, {
        "id": 25,
        "title": "android-device-m4",
        "description": "",
        "date": parseDate("2014-06-09T21:04:02Z")
      }, {
        "id": 26,
        "title": "android-device-unagi",
        "description": "",
        "date": parseDate("2014-06-09T21:04:48Z")
      }, {
        "id": 27,
        "title": "bisect_b2g",
        "description": "B2G Bisection",
        "date": parseDate("2014-02-26T23:51:32Z")
      }, {
        "id": 28,
        "title": "boing",
        "description": "CSS spring physics",
        "date": parseDate("2013-07-10T10:18:16Z")
      }, {
        "id": 29,
        "title": "darwinstreamingserver",
        "description": "Darwin Streaming Server Android Port. http://dss.macosforge.org/",
        "date": parseDate("2014-07-09T09:54:10Z")
      }, {
        "id": 30,
        "title": "device-flatfish",
        "description": "",
        "date": parseDate("2014-06-09T21:03:32Z")
      }];

      this.getItems = function() {
        return items;
      };

      this.getItemById = function(id) {
        return items.filter(function(item) {
          return item.id === Number(id);
        })[0];
      };

      this.addItem = function(obj) {
        obj.id = Math.max.apply(Math, items.map(function(i) { return i.id; })) + 1;
        items.push(obj);
        return obj;
      };

      this.editItem = function(id, newObj) {
        var oldObj = this.getItemById(id);
        oldObj.title = newObj.title;
        oldObj.description = newObj.description;
        oldObj.date = newObj.date;
        return oldObj;
      };
    };

    return new DB();
  });
});
