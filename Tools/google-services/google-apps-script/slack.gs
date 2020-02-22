// sample code that post messages to slack
function postMessage() {
    var url = "https://slack.com/api/chat.postMessage";          // slack API endpoint
    var payload = {
        "token" : "xoxp-1111222233334444aaaabbbbccccdddd",       // token
        "channel" : "ABCD1234",                                  // channelID
        "text" : "<@HGFG1234>\nTest to post message to slack",   // message
        "username" : "test user",                                // user name
        "icon_emoji": ":robot_face:"                             // icon
    };
    var params = {
        "method" : "POST",
        "payload" : payload
    };
    UrlFetchApp.fetch(url, params);
}