// Select the script tag used to load the widget.
var scriptElement = document.querySelector("#your-widget");
// Create an iframe.
var iframe = document.createElement("iframe");
// Insert iframe before script's next sibling, i.e. after the script.
scriptElement.parentNode.insertBefore(iframe, scriptElement.nextSibling);

// The URL of your API, without JSONP callback parameter.
var url = "your-api-url";
// Callback function used for JSONP.
// Executed as soon as server response is received.
function callback(count) {
// Create a div element
var div = document.createElement("div");
// Insert online count to this element.
// I assume that server response is plain-text number, for example 5.
div.innerHTML = count;
// Append div to iframe's body.
iframe.contentWindow.document.body.appendChild(div);
}
// Create a script.
var script = document.createElement("script");
// Set script's src attribute to API URL + JSONP callback parameter.
// It makes browser send HTTP request to the API.
script.src = url + "?callback=callback";