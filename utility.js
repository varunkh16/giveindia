class Utility {
    constructor() {

    }

    //to compute the metadata for the overall requests and active requests
    overallAPICompute(session) {
        var resStat = {
            "Total": session.length
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
                var res = {
                    "average time": getTotalTime / getCount,
                    "count": getCount
                }
                resStat["GET"] = res;
            }
            if (postCount > 0) {
                var res = {
                    "average time": postTotalTime / postCount,
                    "count": postCount
                }
                resStat["POST"] = res;
            }
            if (putCount > 0) {
                var res = {
                    "average time": putTotalTime / putCount,
                    "count": putCount
                }
                resStat["PUT"] = res;
            }
        }
        return resStat;
    }

    //to compute the metadata for the requests in the last hour and last minute
    lastHourMinuteAPIData(session,time) {
        var resStat = {};
        var currentDate = new Date();
        var getTotalTime = 0;
        var postTotalTime = 0;
        var putTotalTime = 0;
        var totalCount = 0;
        var getCount = 0;
        var postCount = 0;
        var putCount = 0;
        for (var i = 0; i < session.length; i++) {
            const start = session[i].time.getTime();
            const end = currentDate.getTime();

            const diff = end - start;
            const seconds = Math.floor(diff / 1000);
            
            if (seconds <= time) {
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
                if (session[i].method == "PUT") {
                    putTotalTime += session[i].duration;
                    totalCount++;
                    putCount++
                }
            }

        }
        resStat["Total"] = totalCount;
        if (getCount > 0) {
            var res = {
                "average time": getTotalTime / getCount,
                "count": getCount
            }
            resStat["GET"] = res;
        }
        if (postCount > 0) {
            var res = {
                "average time": postTotalTime / postCount,
                "count": postCount
            }
            resStat["POST"] = res;
        }
        if (putCount > 0) {
            var res = {
                "average time": putTotalTime / putCount,
                "count": putCount
            }
            resStat["PUT"] = res;
        }
        return resStat;
    }

}

module.exports.Utility = Utility;