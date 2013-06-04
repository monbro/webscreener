// docCookies
////////////////////////////////////////////////////////////////////
docCookies = {  
  getItem: function (sKey) {  
  if (!sKey || !this.hasItem(sKey)) { return null; }  
  return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));  
  },  
  /** 
  * docCookies.setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) 
  * 
  * @argument sKey (String): the name of the cookie; 
  * @argument sValue (String): the value of the cookie; 
  * @optional argument vEnd (Number, String, Date Object or null): the max-age in seconds (e.g., 31536e3 for a year) or the 
  *  expires date in GMTString format or in Date Object format; if not specified it will expire at the end of session;  
  * @optional argument sPath (String or null): e.g., "/", "/mydir"; if not specified, defaults to the current path of the current document location; 
  * @optional argument sDomain (String or null): e.g., "example.com", ".example.com" (includes all subdomains) or "subdomain.example.com"; if not 
  * specified, defaults to the host portion of the current document location; 
  * @optional argument bSecure (Boolean or null): cookie will be transmitted only over secure protocol as https; 
  * @return undefined; 
  **/  
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {  
  if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/.test(sKey)) { return; }  
  var sExpires = "";  
  if (vEnd) {  
    switch (typeof vEnd) {  
    case "number": sExpires = "; max-age=" + vEnd; break;  
    case "string": sExpires = "; expires=" + vEnd; break;  
    case "object": if (vEnd.hasOwnProperty("toGMTString")) { sExpires = "; expires=" + vEnd.toGMTString(); } break;  
    }  
  }  
  document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");  
  },  
  removeItem: function (sKey) {  
  if (!sKey || !this.hasItem(sKey)) { return; }  
  var oExpDate = new Date();  
  oExpDate.setDate(oExpDate.getDate() - 1);  
  document.cookie = escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; path=/";  
  },  
  hasItem: function (sKey) { return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie); }  
}; 


// docCookies.setItem("test1", "Hello world!");  
// docCookies.setItem("test2", "Hello world!", new Date(2020, 5, 12));  
// docCookies.setItem("test3", "Hello world!", new Date(2027, 2, 3), "/blog");  
// docCookies.setItem("test4", "Hello world!", "Sun, 06 Nov 2022 21:43:15 GMT");  
// docCookies.setItem("test5", "Hello world!", "Tue, 06 Dec 2022 13:11:07 GMT", "/home");  
// docCookies.setItem("test6", "Hello world!", 150);  
// docCookies.setItem("test7", "Hello world!", 245, "/content");  
// docCookies.setItem("test8", "Hello world!", null, null, "example.com");  
// docCookies.setItem("test9", "Hello world!", null, null, null, true);  
// alert(docCookies.getItem("test1"));  