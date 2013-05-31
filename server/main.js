Accounts.registerLoginHandler(function(options) {
  if (!options.anonymous)
    return undefined; // don't handle
  _.extend(options, {generateLoginToken: true});
  return Accounts.insertUserDoc(options, {});
});

Meteor.startup(function () {
  // code to run on server at startup
  if (Rooms.find({roomId:'root'}).count() === 0) {
    Rooms.insert({name: 'Default Room', roomId: 'root', users: []});
  }
});