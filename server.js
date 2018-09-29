var express = require('express');
var app = express();
const bodyParser = require('body-parser');

var session = new Array();
var activeReq =new Array();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

// respond with "hello world" when a GET request is made to the homepage
app.all('/process/*', function(req, res) {

    var randSec = randomIntFromInterval(15, 20);

    var timeStamp = new Date();

    var resJSON = {
        "time": timeStamp,
        "method": req.method,
        "headers": req.headers,
        "path": req._parsedUrl.path,
        "query": req.query,
        "duration": randSec
    };

    if (req.body != undefined) {
        resJSON["body"] = req.body;
    }

    activeReq.push(resJSON);

    var id=timeStamp+"|"+req.method;
    setTimeout(function() {
      var val=id.split("|");
      for(var a=0;a<activeReq.length;a++){
        //console.log(activeReq[a].time+"**********"+val[0]);
        if(activeReq[a].time==val[0]){
          if(activeReq[a].method==val[1]){
            console.log(val[0]+"**********"+val[1]);
            console.log("popping the element "+activeReq[a]+" from array "+activeReq);
            activeReq.splice(a,1);
            console.log("popping the element "+activeReq[a]+" from array "+activeReq);
          }
        }
      }
        session.push(resJSON);
        res.send(JSON.stringify(resJSON));
    }, randSec * 1000,id);

});

app.all('/stats', function(req, res) {

    var resJSON = {};

    resJSON["overall"] = overallAPICompute();
    resJSON["active requests"] = getActiveRequests();
    resJSON["one hour"] = lastHourAPIData();
    resJSON["one minute"] = lastMinuteAPIData();

    res.send(JSON.stringify(resJSON));
});

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function overallAPICompute() {
    var resStat = {
        "total": session.length
    }
    if (session.length > 0) {
        var getTotalTime = 0;
        var postTotalTime = 0;
        var putTotalTime = 0;
        var getCount = 0;
        var postCount = 0;
        var putCount = 0;
        for (var i = 0; i < session.length; i++) {
            if (session[i].method == "GET") {
                getTotalTime += session[i].duration;
                getCount++;
            }
            if (session[i].method == "POST") {
                postTotalTime += session[i].duration;
                postCount++
            }
            if (session[i].method == "PUT") {
              putTotalTime += session[i].duration;
              putCount++
          }
        }
        if (getCount > 0) {
            resStat["GET"] = getTotalTime / getCount;
        }
        if (postCount > 0) {
            resStat["POST"] = postTotalTime / postCount;
        }
        if (putCount > 0) {
          resStat["PUT"] = putTotalTime / putCount;
      }
    }
    return resStat;
}

function getActiveRequests(){
  var resStat = {
    "total": activeReq.length
}
if (activeReq.length > 0) {
    var getTotalTime = 0;
    var postTotalTime = 0;
    var putTotalTime = 0;
    var getCount = 0;
    var postCount = 0;
    var putCount = 0;
    for (var i = 0; i < activeReq.length; i++) {
        if (activeReq[i].method == "GET") {
            getTotalTime += activeReq[i].duration;
            getCount++;
        }
        if (activeReq[i].method == "POST") {
            postTotalTime += activeReq[i].duration;
            postCount++
        }
        if (activeReq[i].method == "PUT") {
          putTotalTime += activeReq[i].duration;
          putCount++
      }
    }
    if (getCount > 0) {
        resStat["GET"] = getTotalTime / getCount;
    }
    if (postCount > 0) {
        resStat["POST"] = postTotalTime / postCount;
    }
    if (putCount > 0) {
      resStat["PUT"] = putTotalTime / putCount;
  }
}
return resStat;
}

function lastHourAPIData() {
    var resStat = {};
    var currentDate = new Date();
    var getTotalTime = 0;
    var postTotalTime = 0;
    var totalCount = 0;
    var getCount = 0;
    var postCount = 0;
    for (var i = 0; i < session.length; i++) {
        const start = session[i].time.getTime();
        const end = currentDate.getTime();

        const diff = end - start;
        const seconds = Math.floor(diff / 1000);

        console.log("One Hour:"+seconds);
        if (seconds <= 3600) {
            if (session[i].method == "GET") {
                getTotalTime += session[i].duration;
                totalCount++;
                getCount++;
            }
            if (session[i].method == "POST") {
                postTotalTime += session[i].duration;
                totalCount++;
                postCount++
            }
        }

    }
    resStat["Total"] = totalCount;
    if (getCount > 0) {
        resStat["GET"] = getTotalTime / getCount;
    }
    if (postCount > 0) {
        resStat["POST"] = postTotalTime / postCount;
    }
    return resStat;
}

function lastMinuteAPIData() {
    var resStat = {};
    var currentDate = new Date();
    var getTotalTime = 0;
    var postTotalTime = 0;
    var totalCount = 0;
    var getCount = 0;
    var postCount = 0;
    for (var i = 0; i < session.length; i++) {
        totalCount++;
        const start = session[i].time.getTime();
        const end = currentDate.getTime();

        const diff = end - start;
        const seconds = Math.floor(diff / 1000);

        console.log("One Minute:"+seconds);

        if (seconds <= 60) {
            if (session[i].method == "GET") {
                getTotalTime += session[i].duration;
                getCount++;
            }
            if (session[i].method == "POST") {
                postTotalTime += session[i].duration;
                postCount++
            }
        }

    }
    resStat["Total"] = totalCount;
    if (getCount > 0) {
        resStat["GET"] = getTotalTime / getCount;
    }
    if (postCount > 0) {
        resStat["POST"] = postTotalTime / postCount;
    }
    return resStat;
}

app.listen(3000, function() {
    console.log("Listening on port 3000");
});