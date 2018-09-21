exports.setJWTCookie = key => {
  var date = new Date();
  // Get unix milliseconds at current time plus number of hours
  date.setTime(date.getTime() + 86400000);
  window.document.cookie =
    "sessionKey=" + key + "; expires=" + date + "; path=/";
};

exports.getCookie = cookieName => {
  var cookie = document.cookie.split(";");
  for (let x in cookie) {
    console.log(cookie[x]);
    if (cookie[x].indexOf(cookieName) > -1) {
      let cookieValue = cookie[x].split(`${cookieName}=`);
      return cookieValue[1];
    }
  }
  return false;
};
