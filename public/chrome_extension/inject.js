// var transferUserInfo = function() {
//     var textarea = document.getElementById('transfer-dom-area');
//     textarea.value = JSON.stringify(Globals.user.programs);
// };

// var textarea = document.createElement('textarea');
// textarea.setAttribute('id', 'transfer-dom-area');
// textarea.style.display = 'none';
// document.body.appendChild(textarea);

// var script = document.createElement('script');
// script.appendChild(document.createTextNode('(' + transferUserInfo + ')();'));
// document.body.appendChild(script);

// chrome.extension.sendRequest({internalVariable: textarea.value});
// document.body.removeChild(textarea);


console.log('Inject: IAM here'); // works

// Generate our very random hash code
var hash, uuid;
uuid = new Hashids(uuid.v4());
hash = uuid.encrypt(Date.now());
console.log('random hash: '+hash);

// $('body').html('Whoops!');
// console.log($('.vimeo_holder .player button.as.av').html());

// $('.vimeo_holder .player button.as.av').trigger('click'); // works

var sock = new SockJS('https://ddp--4145-webscreener.meteor.com/sockjs');
sock.onopen = function() {
 console.log('open');
 // 
};
sock.onmessage = function(e) {
  console.log(e.data);
  obj = jQuery.parseJSON(e.data);
  if(e.type == "message") {

    if(typeof obj.server_id != 'undefined') {
      sock.send("{\"msg\":\"connect\",\"version\":\"pre1\",\"support\":[\"pre1\"]}");
      sock.send("{\"msg\":\"method\",\"method\":\"login\",\"params\":[{\"resume\":\"bYcxYfvjuDXgPeehw\"}],\"id\":\"1\"}");
      sock.send("{\"msg\":\"sub\",\"id\":\"TBhzNkMbK646ZZcKc\",\"name\":\"meteor.loginServiceConfiguration\",\"params\":[]}");
      sock.send("{\"msg\":\"sub\",\"id\":\"zW7SXSqyvaRweRaC3\",\"name\":\"rooms\",\"params\":[]}");

      // Login as anonymous
      sock.send("{\"msg\":\"method\",\"method\":\"login\",\"params\":[{\"anonymous\":true}],\"id\":\"2\"}");

    }
    else if(typeof obj.msg != 'undefined') {

      if(obj.msg == "result") {
        if(obj.id == 2) {
          console.log('Got User / Login Ident: '+obj.result.id);
          userId = obj.result.id;
          now = new Date().getTime();

          // open new room
          sock.send("{\"msg\":\"method\",\"method\":\"roomenter\",\"params\":[{\"roomId\":\""+hash+"\"}],\"id\":\"3\"}");
        }
        else if(obj.id == 3) {
          roomInsertId = obj.result;
          sock.send("{\"msg\":\"method\",\"method\":\"/rooms/update\",\"params\":[{\"_id\":\""+roomInsertId+"\"},{\"$push\":{\"users\":{\"name\":\""+userId+"\",\"touch\":{\"$date\":"+now+"}}}}],\"id\":\"4\"}");
        }
        else if(obj.id == 4) {
          $('body').append('<div id="webscreener-url-announce" style="z-index:9999;position:fixed;top:0;right:0;padding:30px;background:rgba(0,0,0,0.85);display:none;"><a target="_blank" href="http://webscreener.meteor.com/room/'+hash+'/" style="color:white;">http://webscreener.meteor.com/room/'+hash+'</a></div>');
          $('div#webscreener-url-announce').fadeIn();
        }
      }
      else if(obj.msg == "changed") {
        if(obj.collection == "rooms" && obj.id == roomInsertId) {
          // if(obj.fields.actions[0].name)
          if(typeof obj.fields.actions != 'undefined' && obj.fields.actions.length !== 0) {
            if(obj.fields.actions[0].name == "toggleLight") {
              if($('body').css('background-color') == 'rgb(0, 0, 0)')
                $('body').css('background-color','white');
              else
                $('body').css('background-color','black');

              $('.vimeo_holder .player button.as.av').trigger('click');
            }
          }
        }
      }

    }

  }
};
sock.onclose = function() {
 console.log('close');
};

