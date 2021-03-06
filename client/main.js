roomsHandle = null;
Deps.autorun(function () {
    roomsHandle = Meteor.subscribe('rooms');
});


Template.hello.greeting = function () {
  return "Welcome to webscreener.";
};

Template.hello.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});

Template.rooms.loading = function () {
  return roomsHandle && !roomsHandle.ready();
};

Template.room.loading = function () {
  return roomsHandle && !roomsHandle.ready();
};

Template.rooms.rooms = function () {
  return Rooms.find({},{});
};

Template.room.events({
  'click .btn[command=togglePlay]' : function () {
    roomId = Session.get('currentRoomId');
    room = Rooms.findOne({roomId:roomId},{});
    Rooms.update(room._id,{$push: {"actions": {name: 'togglePlay'}}});
  },
  'click .btn[command=toggleFullscreen]' : function () {
    roomId = Session.get('currentRoomId');
    room = Rooms.findOne({roomId:roomId},{});
    Rooms.update(room._id,{$push: {"actions": {name: 'toggleFullscreen'}}});
  },
  'click .btn[command=toggleLight]' : function () {
    roomId = Session.get('currentRoomId');
    room = Rooms.findOne({roomId:roomId},{});
    Rooms.update(room._id,{$push: {"actions": {name: 'toggleLight'}}});
  },
  'click .btn[command=youtubeSearch]' : function () {
    roomId = Session.get('currentRoomId');
    room = Rooms.findOne({roomId:roomId},{});
    Rooms.update(room._id,{$push: {"actions": {name: 'youtubeVideo', query: $('input.query').val()}}});
  },
  'click .btn.push.listener' : function () {
    roomId = Session.get('currentRoomId');
    room = Rooms.findOne({roomId:roomId},{});
    console.log($(this).attr('xpath'));
    Rooms.update(room._id,{$push: {"actions": {name: 'xpath', xpath: $(this).attr('xpath')}}});
  },
  'click .btn[command=goBack]' : function () {
    Rooms.update(room._id,{$push: {"actions": {name: 'goBack'}}});
  },
  'click .btn[command=toggleNav]' : function () {
    Rooms.update(room._id,{$push: {"actions": {name: 'toggleNav'}}});
  },
});

function getYtbVid(url) {
    var ytb_regexpr = new RegExp('(?:youtube\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})', "i" );
    ytb_regexpr = url.match(ytb_regexpr);
    var ytb_vid = ytb_regexpr[1];
    return ytb_vid;
}

printAction = function () {

  // now = (new Date().getTime() / 1000);
  // diff = (Math.floor(now - Session.get('dateRoomEntered')));
  // console.log(diff);
  // if(diff > 5) {

    if(Session.get('isViewer')) {

      roomId = Session.get('currentRoomId');
      room = Rooms.findOne({roomId:roomId},{});
      if(typeof room != 'undefined') {
        lastAction = room.actions.pop();
        // console.log(lastAction);

        if(typeof lastAction != 'undefined') {

          if(lastAction.name == 'toggleLight') {
            if($('body').css('background-color') == 'rgb(0, 0, 0)')
              $('body').css('background-color','white');
            else
              $('body').css('background-color','black');
          }
          else if(lastAction.name == 'youtubeVideo') {
            // console.log(lastAction.query);
            Meteor.call('youtube', {query: lastAction.query}, function(err, result) {
              console.log('youtube call done! '+err+' - '+result);
              ytbId = getYtbVid(result.data.feed.entry[0].content.src);
              if(typeof ytbId != 'undefined' && ytbId !== '')
                $('div#media').html('<iframe width="420" height="315" src="http://www.youtube.com/embed/'+ytbId+'?&autoplay=1" frameborder="0" allowfullscreen></iframe>');
            });
          }

        }


      }
    }

  // }

};

// Deps.autorun(printAction);

Template.room.room = function() {
  roomId = Session.get('currentRoomId');
  room = Rooms.findOne({roomId:roomId},{});

  if(typeof room == 'undefined') {
    Meteor.call('roomenter', {roomId: roomId}, function(err, result) {
      console.log('room Added!');
      return roomHelper(roomId);
    });
  }
  else {
    return roomHelper(roomId);
  }
};

roomHelper = function(roomId) {

  // customUserName = 'admin3';
  customUserName = Session.get('currentUserId');

  // var jetzt = new Date();
  // var Zeit = jetzt.getTime() / 1000;
  // var Jahr2020 = new Date(2020, 0, 1, 0, 0, 0);
  // var Endzeit = Jahr2020.getTime() / 1000;
  // var Rest = Math.floor(Endzeit - Zeit);

  now = new Date();

  if(typeof room.users[1] == 'undefined') {
    Session.set('isViewer', true);
    console.log('isViewer is true');
    console.log(room.users);
  }
  else {
    Session.set('isViewer', false);
  }

  // loop whole users in this room
  active = false;
  $.each(room.users, function(index, value) {

    if(value.name == customUserName) {
      active = true;
    }
    else {
      // is done serverside now !!

      // if any user found with lifetime < now()- 60 sec delete him
      // touch = (new Date(value.touch).getTime() / 1000);
      // newnow = (new Date().getTime() / 1000);
      // diff = (Math.floor(newnow - touch));
      // console.log(diff);
      // if(diff > 60) {
      //   //db.temp.update({ _id : "777" }, {$pull : { "someArray.0.someNestedArray" : {"name":"delete me"} } }
      //   Rooms.update(room._id,{$pull: {"users": {name: value.name}}});
      // }
    }

  });

  // console.log(active);

  // if user is not found, push a new one inside the room
  if(!active) {
    Rooms.update(room._id,{$push: {"users": {name: customUserName, touch: now}}});
  }

  // userExists = Rooms.findOne({id:room._id, users: {name: 'admin1'}});

  // console.log('check: '+userExists+' in '+room._id);

  // if (typeof userExists == 'undefined' && !Session.get('updated')) {
  //     // Rooms.update(room._id, {$set: {users: {name: 'admin1', test:'test'}}});
  //     Rooms.update(room._id,{$push:{"users":{name:"admin1"}}});
  //     Session.set('updated', true);
  // }
  // else {

  // }
  // console.log(room.users);
  return room;
};

Handlebars.registerHelper('currentUserId',function(input){
  return Session.get("currentUserId");
});

Handlebars.registerHelper('isViewer',function(input){
  return Session.get("isViewer");
});

Handlebars.registerHelper('isDebug',function(input){
  return Session.get("isDebug");
});



// Handlebars.registerHelper("navClassFor", function (nav, options) {
//   return Meteor.router.navEquals(nav) ? "active" : "";
// });

// function keepAlive() {
//   Meteor.call('keepalive', {userId: Session.get("currentUserId")}, function(err, result) {
//     console.log('keepAlive call done! '+err+' - '+result);
//   });
// }

Meteor.startup(function () {
  // Backbone.history.start();
  // Backbone.history.start({pushState: true, root: '/'});
  // // Meteor.loginAnonymously();
  // Meteor.call('login', {anonymous: true}, function(err, result) {
  //   // console.log(result.id);
  //   Accounts._makeClientLoggedIn(result.id, result.token);
  //   // fn && fn();
  // });

  // Display Debug Information
  Session.set('isDebug', true);

  Meteor.call('login', {anonymous: true}, function(err, result) {
    Accounts._makeClientLoggedIn(result.id, result.token);
    // console.log('currentUserId: '+result.id);
    Session.set('currentUserId', result.id);
  });

  // send keep alive every 3 seconds
  // Meteor.setInterval( function () {
  //   keepAlive();
  // }, 3000 );

});




