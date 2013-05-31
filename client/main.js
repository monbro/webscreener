Template.hello.greeting = function () {
  return "Welcome to webscreener2.";
};

Template.hello.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});

Meteor.Router.add({
  '/news': { as: 'news', to: function() {
      return 'news';
  }},
  '/': { as: 'root', to: function() {
      return 'hello';
  }},
  '/about': function() {
    if (Session.get('aboutUs')) {
      return 'aboutUs';
    } else {
      return 'aboutThem';
    }
  },

  '*': 'not_found'
});

// Handlebars.registerHelper("navClassFor", function (nav, options) {
//   return Meteor.router.navEquals(nav) ? "active" : "";
// });

Meteor.startup(function () {
  // Backbone.history.start();
  // Backbone.history.start({pushState: true, root: '/'});
  // // Meteor.loginAnonymously();
  // Meteor.call('login', {anonymous: true}, function(err, result) {
  //   // console.log(result.id);
  //   Accounts._makeClientLoggedIn(result.id, result.token);
  //   // fn && fn();
  // });
});