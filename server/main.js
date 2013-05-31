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

function checkUserAlive() {
  // users = Users.find({},{});
  rooms = Rooms.find({},{}).fetch();

  rooms.foreach( function( k, v ) {
    // console.log(v.users);
    v.users.foreach( function( a, b ) {
      if(isUserOnline(b.name)) {
        console.log(b.name+' is alive!');
      }
      else {
        // remove User from List
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
  if (Rooms.find({roomId:'root'}).count() === 0) {
    Rooms.insert({name: 'Default Room', roomId: 'root', users: []});
  }


  Meteor.setInterval( function () {
    checkUserAlive();
  }, 2000 );

  // Meteor.methods({
  //   keepalive: function (params) {
  //     console.log(params);
  //     console.log(isUserOnline(params.userId));
  //   }
  // });

});