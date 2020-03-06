// sample code that post messages to slack
function postMessage() {
    let url = "https://slack.com/api/chat.postMessage";          // slack API endpoint
    let timeStamp = = Math.round((new Date()).getTime() / 1000);
    let payload = {
        "token" : "xoxp-1111222233334444aaaabbbbccccdddd",       // token
        "channel" : "ABCD1234",                                  // channelID
        "text" : "<@HGFG1234>\nTest to post message to slack",   // message
        "username" : "test user",                                // user name
        "icon_emoji": ":robot_face:",                            // icon
        // rich message attachments
        "attachments": JSON.stringify([
            {
                pretext: "ex) This is a pretext",
                color: "good",
                author_name: "yossiee",
                author_link: "https://github.com/yossiee",
                author_icon: "https://avatars0.githubusercontent.com/u/38056766?s=400&v=4",
                thumb_url: "https://github.com/yossiee/til",
                title: "Thi is a title",
                title_link: "https://github.com/yossiee",
                text: "ex) This is text",
                footer: "ex) Send from Google Apps Script",
                footer_icon: "https://www.gstatic.com/images/branding/product/2x/apps_script_64dp.png",
                ts: timeStamp,
            }
        ])
    };
    let params = {
        "method" : "POST",
        "payload" : payload
    };
    let res = UrlFetchApp.fetch(url, params);
}
