const LoadObjectData = function () {
  return new Promise((resolve, reject) => {
    var OpenDoc = {
      handle: -1,
      method: "OpenDoc",
      params: [localStorage.getItem("appId")],
      outKey: -1,
      id: 1,
    };

    var getObjects = {
      handle: 1,
      method: "GetObject",
      params: [localStorage.getItem("sheetId")],
      outKey: -1,
      id: 2,
    };
    var sheetList_ws = new WebSocket(
      "wss://" +
        "qlikdemo.polestarllp.com" +
        "/app/" +
        localStorage.getItem("appId") +
        "?reloadUri=https://" +
        "qlikdemo.polestarllp.com" +
        "/dev-hub/engine-api-explorer&v" +
        new Date()
    );

    sheetList_ws.onopen = function (msg) {
      console.log("Sheet list connection opened");
      sheetList_ws.send(JSON.stringify(OpenDoc));
    };

    sheetList_ws.onerror = function () {
      console.log("Error!!", "Some issues fetching app list");
    };

    // sheetList_ws.onclose = function () {
    //     console.log("Websocket connection closed");
    //     sheetList_ws = null;
    // };

    sheetList_ws.onmessage = function (data, flags) {
      var wsres = JSON.parse(data.data);
      console.log(wsres);
      if (wsres.id === 1) {
        sheetList_ws.send(JSON.stringify(getObjects));
      }
      if (wsres.id === 2) {
        resolve(wsres);
      }
    };
  });
};
