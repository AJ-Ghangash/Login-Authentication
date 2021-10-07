/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */

var config = {
    host: "qlikdemo.polestarllp.com",
    prefix: "/virproxy/",
    port: "443",
    isSecure: true,
   
};
require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
});

require(["js/qlik"], function (qlik) {
    qlik.setOnError(function (error) {
        $('#popupText').append(error.message + "<br>");
        $('#popup').fadeIn(1000);
    });
    $("#closePopup").click(function () {
        $('#popup').hide();
    });

    //callbacks -- inserted here --
    //open apps -- inserted here --
    var app = qlik.openApp(localStorage.getItem("appId"), config);
    
    //get objects -- inserted here --
    app.getObject('QV01',localStorage.getItem("object1"));
    app.getObject('QV02',localStorage.getItem("object2"));
    app.getObject('QV03',localStorage.getItem("object3"));
    app.getObject('QV04',localStorage.getItem("object4"));
    //create cubes and lists -- inserted here --    
});

