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

      sock.send("{\"msg\":\"method\",\"method\":\"login\",\"params\":[{\"anonymous\":true}],\"id\":\"2\"}");

    }
    else if(typeof obj.msg != 'undefined') {

      if(obj.msg == "result") {
        if(obj.id == 2) {
          console.log('Got User / Login Ident: '+obj.result.id);
          userId = obj.result.id;
          now = new Date().getTime();
          sock.send("{\"msg\":\"method\",\"method\":\"/rooms/update\",\"params\":[{\"_id\":\"je9SCLeg2DxwPWuvA\"},{\"$push\":{\"users\":{\"name\":\""+userId+"\",\"touch\":{\"$date\":"+now+"}}}}],\"id\":\"3\"}");
        }
      }
      else if(obj.msg == "changed") {
        if(obj.collection == "rooms") {
          // if(obj.fields.actions[0].name)
          if(typeof obj.fields.actions != 'undefined' && obj.fields.actions.length != 0) {
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

