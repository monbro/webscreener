// Publish complete set of lists to all clients.
Meteor.publish('rooms', function () {
  return Rooms.find();
});