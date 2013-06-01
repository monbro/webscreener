Accounts.registerLoginHandler(function(options) {
  if (!options.anonymous)
    return undefined; // don't handle
  _.extend(options, {generateLoginToken: true});
  return Accounts.insertUserDoc(options, {});
});

var isUserOnline = function(userId) {
  var sockets = Meteor.default_server.stream_server.open_sockets;
  return _.any(sockets,function(socket){
    return userId === socket.meteor_session.userId;
  });
};

function garbageCollectorActions() {
  rooms = Rooms.find({},{}).fetch();

  rooms.foreach( function( k, v ) {

    // just reset all actions
    Rooms.update(v._id, {$set: {actions: []}});

    // aL = v.actions.length;
    // v.actions.foreach( function( a, b ) {
    //   console.log('donot: '+(aL-1));
    //   if(a != (aL-1) && a != (aL-2) && a != (aL-3)) {
    //     console.log('remove '+a);
    //     Rooms.update(v._id,{$pull: {"actions": {name: b.name}}});
    //   }
    // });

  });
}

function garbageCollectorRooms() {
  rooms = Rooms.find({},{}).fetch();

  rooms.foreach( function( k, v ) {

    // just reset all actions
    if(v.users.length === 0) {
      Rooms.remove(v._id);
    }

  });
}



function garbageCollectorUser() {
  rooms = Rooms.find({},{}).fetch();

  // Loop all rooms
  rooms.foreach( function( k, v ) {
    // Loop all users of current room
    v.users.foreach( function( a, b ) {
      if(isUserOnline(b.name)) {
        // console.log(b.name+' is alive!');
      }
      else {
        // remove User from List
        console.log(b.name+' to be removed!');
        Rooms.update(v._id,{$pull: {"users": {name: b.name}}});
      }
    });

  });


  // jQuery.each(rooms, function(index, value) {
  //   console.log(value.users);
  // });
}

Meteor.startup(function () {
  // code to run on server at startup
  // if (Rooms.find({roomId:'root'}).count() === 0) {
  //   Rooms.insert({name: 'Default Room', roomId: 'root', users: [], actions: []});
  // }

  Meteor.setInterval( function () {
    garbageCollectorUser();
  }, 2000 );

  Meteor.setInterval( function () {
    garbageCollectorActions();
  }, 10000 );

  Meteor.setInterval( function () {
    garbageCollectorRooms();
  }, 20000 );

  // Meteor.methods({
  //   keepalive: function (params) {
  //     console.log(params);
  //     console.log(isUserOnline(params.userId));
  //   }
  // });

  Meteor.methods({
    youtube: function (params) {
      // check(userId, String);
      this.unblock();
      var result = Meteor.http.call("GET", "http://gdata.youtube.com/feeds/api/videos?alt=json&v=2&q="+encodeURIComponent(params.query),
        {params: {}});
      if (result.statusCode === 200) {
        return result;
      }
      else
        return false;
    },
    roomenter: function (params) {
      if (Rooms.find({roomId: params.roomId}).count() === 0) {
        id = Rooms.insert({name: 'New Room by Chrome Extension', roomId: params.roomId, users: [], actions: []});
        return id;
      }
      else {
        return false;
      }
    }
  });

  //http://gdata.youtube.com/feeds/api/videos?q=michael%20jackson%20thriller&alt=json&v=2

});