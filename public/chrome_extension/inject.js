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


// console.log('Inject: IAM here'); // works

msgCounter = 1;

getRandomHash = function() {
  var hash, uuid;
  uuid = new Hashids(window.uuid.v4());
  hash = uuid.encrypt(Date.now());
  return hash;
};

var roomHash;

console.log(docCookies.getItem("roomHash"));

if(docCookies.getItem("roomHash") !== null && docCookies.getItem("roomHash") != 'null')
  roomHash = docCookies.getItem("roomHash");
else {
  roomHash = getRandomHash();
  docCookies.setItem("roomHash", roomHash);
}

// Generate our very random hash code

$('body').prepend('<div class="webscreener"></div>');
$('body').prepend('<div class="webscreeneropener btn">open</div>');
wrapper = $('.webscreener');
wrapper.append('<div class="topbar row-fluid"></div>');
topbar = $('.webscreener .topbar');
wrapper.append('<div class="info row-fluid"></div>');
info = $('.webscreener .info');
info.append('<div class="span6 listenerinfo"><ul><li class="name">Name: <span></span></li><li class="classes">Classes: <span></span></li><li class="xpath">Xpath: <span></span></li></ul></div>');

topbar.append('<div class="span4"><div class="btn slideup">close</div> <div class="btn selectlistener">select Listener</div> <div class="btn addlistener">add Listener</div> <div class="btn newRoom">new Room</div></div>');
topbar.append('<div class="span4"><h2>Webscreener</h2><h6>Remote-Control for any website</h6></div>');

wrapper.find('.slideup').on('click', function() {
  wrapper.slideUp('fast', function() {
    $('.webscreeneropener').fadeIn();
  });
});


var cancelHelper = function() {
  if(!$selectListener) {
    wrapper.find('.selectlistener').html('cancel');
  }
  else {
    wrapper.find('.selectlistener').html('select Listener');
  }
  $selectListener = !$selectListener;
};

wrapper.find('.selectlistener').on('click', function() {
  cancelHelper();
});

wrapper.find('.newRoom').on('click', function() {
  // destroy session
  docCookies.setItem("userToken", null);
  docCookies.setItem("roomInsertId", null);
  docCookies.setItem("roomHash", null);
  // reload page
  window.location.reload();
});

wrapper.find('.addlistener').on('click', function() {

  cancelHelper();

  if(typeof sock != 'undefined') {
    var name = info.find('.listenerinfo .name span').html();
    var classes = info.find('.listenerinfo .classes span').html();
    // var xpath = info.find('.listenerinfo .xpath span').html();
    var xpath = $lastClickedElement;
    sock.send("{\"msg\":\"method\",\"method\":\"/rooms/update\",\"params\":[{\"_id\":\""+roomInsertId+"\"},{\"$push\":{\"listener\":{\"name\":\""+name+"\",\"classes\":\""+classes+"\",\"xpath\":\""+xpath+"\"}}}],\"id\":\""+msgCounter+"\"}");
    msgCounter++;
  }
});

$('.webscreeneropener').on('click', function() {
  $('.webscreeneropener').hide();
  wrapper.slideDown('fast');
});

function getXPath( element )
{
    var xpath = '';
    for ( ; element && element.nodeType == 1; element = element.parentNode )
    {
        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
        id > 1 ? (id = '[' + id + ']') : (id = '');
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
}

// http://stackoverflow.com/questions/4284086/using-xpath-to-select-elements-in-jquery
(function($) {
    $.xpath = function(exp, ctxt) {
        var item, coll = [],
            result = document.evaluate(exp, ctxt || document, null, 5, null);

        // while (item = result.iterateNext())
        //     coll.push(item);

        // return $(coll);

        // edited:
        while (item = result.iterateNext())
          return item;
    };
})(jQuery);

/* jQuery Extensions  get XSS Path as String
 * form radiozeug bundle
************************************/
jQuery.fn.getPath = function () {
  if (this.length != 1) {throw 'Requires one element.';}

  var path, node = this;
  while (node.length) {
    var realNode = node[0], name = realNode.localName;
    if (!name) break;
    name = name.toLowerCase();

    var parent = node.parent();

    var siblings = parent.children(name);
    if (siblings.length > 1) {
      name += ':eq(' + siblings.index(realNode) + ')';
    }

    path = name + (path ? '>' + path : '');
    node = parent;
  }

  return path;
};

$(function(){

  var last_element = null;
  $selectListener = false;

  $("body *").on("click", function(event){

    if($selectListener) {
      // for control only
      // $(this).on('click', function() {
      //  console.log("clicked the xpath item");
      // });

      // prevent default action
      event.preventDefault();
      console.log('prevent success!');

      // $(this).trigger('click');

      if($(this).html() === '' || typeof $(this).html() == 'undefined')
        info.find('.listenerinfo .name span').html($(this).val());
      else
        info.find('.listenerinfo .name span').html($(this).html());
      if($(this).attr('class') === '' || typeof $(this).attr('class') == 'undefined')
        info.find('.listenerinfo .classes span').html('');
      else
        info.find('.listenerinfo .classes span').html($(this).attr('class'));

      $lastClickedElement = $(this).getPath();

      info.find('.listenerinfo .xpath span').html($lastClickedElement);

      // var is_different_elem = $(this)[0] != $(last_element)[0];
      // if (last_element === null || is_different_elem || $(".dialogs").length === 0) {
      //   // $(".dialogs").remove();
      //   // $(this).append("<div class='inspect_dialog dialogs'></div>");
      //   var element = $(this).get(0).tagName.toLowerCase();

      //   var id = $(this).attr("id");
      //   if (id)
      //     id = "#"+id;
      //   else
      //     id = "";

      //     var klass = $(this).attr("class"); // TODO: multiple classes support
      //     if (klass)
      //       klass = "."+klass.replace(/\s*inspect_dh_hover/, '');
      //     else
      //       klass = "";

      //     var infos = "element: "+element+id+klass;
      //     // console.log(infos); // 2do multiple elements stuff?
      //     // $(".inspect_dialog").html(infos).show();
      //     info.find('.listenerinfo').html(infos);
      // }
      // else {
      //   // $(".dialogs").remove();
      // }
      // last_element = this;
      return false;
    }
    else {
      // do nothing
    }

  });

  // $("body *").hover(function(){
  //   if($selectListener) {
  //     if($(this).parents('.webscreener').length && !$(this).hasClass('webscreener')) {
  //       return false;
  //     }
  //     $(this).addClass("inspect_dh_hover");
  //     // $(this).width($(this).width()-2).height($(this).height()-2);
  //   }
  // }, function(){
  //   if($selectListener) {
  //     if($(this).parents('.webscreener').length && !$(this).hasClass('webscreener')) {
  //       return false;
  //     }

  //     // $(".dialogs").remove();
  //     $(this).removeClass("inspect_dh_hover");
  //     // $(this).width($(this).width()+2).height($(this).height()+2);
  //   }
  // });


});



// $('body').html('Whoops!');
// console.log($('.vimeo_holder .player button.as.av').html());

// $('.vimeo_holder .player button.as.av').trigger('click'); // works

var domain = 'http://localhost/';
// var domain = 'https://ddp--4145-webscreener.meteor.com/';

var sock;

var toggle;

var navHidden = false;

new_conn = function() {

  sock = new SockJS(domain+'sockjs', null, {'debug': true});

  sock.onopen = function() {
   console.log('socket opened');
   //
  };

  // error after one reconnect socket pipe is not closed (from server?)

  // sock.on('connection', function(conn){
  //   console.log(" [.] open event received");
  //   var t = setInterval(function(){
  //     try{
  //       conn._session.recv.didClose();
  //     } catch (x) {}
  //   }, 15000);
  //   conn.on('close', function() {
  //     console.log(" [.] close event received");
  //     clearInterval(t);
  //   });
  // });
  sock.onmessage = function(e) {
    // console.log(e.data);
    obj = jQuery.parseJSON(e.data);
    if(e.type == "message") {

      if(typeof obj.server_id != 'undefined') {
        sock.send("{\"msg\":\"connect\",\"version\":\"pre1\",\"support\":[\"pre1\"]}");
        // sock.send("{\"msg\":\"method\",\"method\":\"login\",\"params\":[{\"resume\":\"bYcxYfvjuDXgPeehw\"}],\"id\":\"1\"}");
        // sock.send("{\"msg\":\"sub\",\"id\":\"TBhzNkMbK646ZZcKc\",\"name\":\"meteor.loginServiceConfiguration\",\"params\":[]}");
        // sock.send("{\"msg\":\"sub\",\"id\":\"zW7SXSqyvaRweRaC3\",\"name\":\"rooms\",\"params\":[]}");
        if(docCookies.getItem("userToken") !== null && docCookies.getItem("userToken") != 'null')
          userToken = docCookies.getItem("userToken");
        else {
          userToken = null;
          console.log('set userToken to null');
        }

        // console.log('Last Usertoken:'+userToken);

        if(userToken != null) {
          sock.send("{\"msg\":\"method\",\"method\":\"login\",\"params\":[{\"resume\":\""+userToken+"\"}],\"id\":\""+msgCounter+"\"}");
        }
        else {
          // sock.send("{\"msg\":\"method\",\"method\":\"login\",\"id\":\"1\"}");

          // Login as anonymous
          sock.send("{\"msg\":\"method\",\"method\":\"login\",\"params\":[{\"anonymous\":true}],\"id\":\""+msgCounter+"\"}");
        }

        msgCounter++;


        collectionLoginServicesHash = getRandomHash();
        sock.send("{\"msg\":\"sub\",\"id\":\""+collectionLoginServicesHash+"\",\"name\":\"meteor.loginServiceConfiguration\",\"params\":[]}");

        collectionRoomsHash = getRandomHash();
        sock.send("{\"msg\":\"sub\",\"id\":\""+collectionRoomsHash+"\",\"name\":\"rooms\",\"params\":[]}");

      }
      else if(typeof obj.msg != 'undefined') {

        if(obj.msg == "result") {
          if(obj.id == 1) {
            console.log('Got User / Login Ident: '+obj.result.id);
            userId = obj.result.id;
            userToken = obj.result.token;
            docCookies.setItem("userToken", userToken);
            now = new Date().getTime();

            // open new room
            sock.send("{\"msg\":\"method\",\"method\":\"roomenter\",\"params\":[{\"roomId\":\""+roomHash+"\"}],\"id\":\""+msgCounter+"\"}");
            msgCounter++;
          }
          else if(obj.id == 2) {
            if(obj.result === false) {
              roomInsertId = docCookies.getItem("roomInsertId");
              sock.send("{\"msg\":\"method\",\"method\":\"/rooms/update\",\"params\":[{\"_id\":\""+roomInsertId+"\"},{\"$push\":{\"users\":{\"name\":\""+userId+"\",\"touch\":{\"$date\":"+now+"}}}}],\"id\":\""+msgCounter+"\"}");
              msgCounter++;
            }
            else {
              roomInsertId = obj.result;
              docCookies.setItem("roomInsertId", roomInsertId);
              sock.send("{\"msg\":\"method\",\"method\":\"/rooms/update\",\"params\":[{\"_id\":\""+roomInsertId+"\"},{\"$push\":{\"users\":{\"name\":\""+userId+"\",\"touch\":{\"$date\":"+now+"}}}}],\"id\":\""+msgCounter+"\"}");
              msgCounter++;
            }
          }
          else if(obj.id == 3) {
            $('div.url-container').remove();
            topbar.append('<div class="span4 url-container">Try from any device:<br /><a class="url" target="_blank" href="'+domain+'room/'+roomHash+'/">'+domain+roomHash+'</a></div>');
            $('div.url-container').fadeIn();
          }
        }
        else if(obj.msg == "changed") {
          if(obj.collection == "rooms" && obj.id == roomInsertId) {
            // if(obj.fields.actions[0].name)
            if(typeof obj.fields.actions != 'undefined' && obj.fields.actions.length !== 0) {
              lastItem = obj.fields.actions.pop();
              command = lastItem.name;
              console.log("do command: "+command);
              if(command == "toggleLight") {
                if($('body').css('background-color') == 'rgb(0, 0, 0)')
                  $('body').css('background-color','white');
                else
                  $('body').css('background-color','black');
              }
              else if(command == "togglePlay") {
                // toggle = $('.play-wrapper button.play').hasClass('state-paused');
                $('html>body>div:eq(2)>div:eq(1)>div:eq(1)>div>div:eq(1)>div:eq(0)>div>div>div:eq(1)').trigger('click');
              }
              else if(command == "toggleFullscreen") {
                // $('.player .h.av .s canvas').trigger('click');
                // not working atm
              }
              else if(command == "toggleNav") {
                if(navHidden) {
                  navHidden = !navHidden;
                  wrapper.find('.slideup').click();
                }
                else {
                  navHidden = !navHidden;
                  $('.webscreeneropener').click();
                }
              }
              else if(command == "xpath") {
                var xpath = lastItem.xpath;
                console.log("do it on xpath: "+xpath);
                // $(xpath).trigger('click');
                                      // var item = $.xpath(xpath);
                // console.log(item);
                // console.log($(item));

                // $(item).trigger('click'); // seems to work !! but not on a elements, but on canvas play button?

                xpathItem = $(xpath);
                xpathItem.trigger('click');

                if(xpathItem.is("a")) {
                  window.location.href = xpathItem.attr('href');
                }

              }
              else if(command == 'goBack') {
                history.go(-1);
              }
            }
          }
        }

      }

    }
  };


};

new_conn();

sock.onclose = function() {
 console.log('socket closed');
 topbar.find('.url-container .url').html('Connection lost ... trying to reconnect!');
 msgCounter = 1;
 setTimeout(new_conn, 1000);
 // new_conn();
};

