// Publish complete set of lists to all clients.
Meteor.publish('rooms', function () {
  return Rooms.find();
});

Rooms = new Meteor.Collection("rooms");

Rooms.allow({
  insert: function (roomId, doc) {
    return true;
  },
  update: function (roomId, doc, fields, modifier) {
    // can only change your own documents
    return true;
  },
  remove: function (roomId, doc) {
    return true;
  }
  // fetch: ['owner']
});