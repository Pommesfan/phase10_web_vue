import {str_teamID, str_thisPlayer} from "@/mixins/utils";

export var websocket = null

export function connectWebSocket(updateFunction) {
    let newWebsocket = new WebSocket("ws://" + location.hostname + ":9000/websocket");

    newWebsocket.onopen = function() {
        console.log("Trying to connect to Server");
        newWebsocket.send(JSON.stringify({
            "cmd": "loginPlayer",
            "loggedInPlayer": sessionStorage.getItem(str_thisPlayer),
            "team_id": sessionStorage.getItem(str_teamID)
        }))
        newWebsocket.send(JSON.stringify({"cmd": "getStatus"}))
    }

    newWebsocket.onclose = function () {
        console.log('Connection Closed!');
    };

    newWebsocket.onerror = function (error) {
        console.log('Error Occured: ' + error);
    };

    newWebsocket.onmessage = function (e) {
        if (typeof e.data === "string") {
            let js = JSON.parse(e.data)
            updateFunction(js)
        }
        else if (e.data instanceof ArrayBuffer) {
            console.log('ArrayBuffer received: ' + e.data);
            alert('ArrayBuffer received: ' + e.data)
        }
        else if (e.data instanceof Blob) {
            console.log('Blob received: ' + e.data);
            alert('Blob received: ' + e.data)
        }
    };
    websocket = newWebsocket
}