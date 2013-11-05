# Webscreener (Prototype, Alpha)
Currently a chrome extension which will allow you nearly real time remote control of any website trough an automatic generated interface.

## Description
Remote control for any website (current prototype vimeo.com only). Add click events to any html element and activate them trough the web interface in the showen url. You need to install a google chrome extension to use the remote control.

## Hot to start the server on localhost
* Ensure you are on the latest nodeJS and meteor or meteorite version
* start the meteor server with port 80 like 'meteor --port 80'

## How to use on vimeo
* Download Chrome-Extension-File from /public/chrome_extension.crx or load the unpacked from /pulic/chrome_extension/ via http://developer.chrome.com/extensions/getstarted.html#unpacked

* Activate the extension if it isnt and go to a new Vimeo-Video-Subpage like https://vimeo.com/64448741

* In the top right corner will show up a URL, open the url in any device with internet connection

* Try the available command buttons to remote-control this vimeo subpage.

* Try to add Event-Trigger by yourself by

    a) click Button "select Listener"

    b) click on HTML element

    c) click Button "add Listener"

If successful it should look like

![Image](https://dl.dropboxusercontent.com/u/45446322/basic_git.png)

## Used technology

websockets, node js via meteor, chrome extension system, mongodb


------

## Development Notes

Using a basic structure

Working with custom MongoDB [export MONGO_URL='mongodb://localhost:27017/webscreener]

Working with meteorite https://github.com/oortcloud/meteorite http://oortcloud.github.io/meteorite/

Working with router package https://atmosphere.meteor.com/package/router
    - Alternative would be Backbone.Router
    - Alternative would be http://cmather.github.io/meteor-mini-pages/classes/PageRouter.PageInvocation.html

Working with accounts-base

Working with http

Working with
  "accounts-anonymous": {
    "git": "https://github.com/rissem/meteor-accounts-anonymous"
  }

Working with MongoHub.app https://github.com/fotonauts/MongoHub-Mac

Using a Chrome Extension http://developer.chrome.com/extensions/getstarted.html

### Helpful

http://stackoverflow.com/questions/13504324/where-can-we-host-meteor-meteorite-applications

To run another port use "mrt --port 5000"

## To do

Datatype check on chrome extension side (when receiving data from server)

Datatype check on server side (when receiving data from clients)

Make always connection from Chrome Extension as Viewer per default

Close all remote controll connections if Viewer is dead?
