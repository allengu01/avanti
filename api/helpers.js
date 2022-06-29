// Serializes a params dictionary into application/x-www-form-urlencoded format
export const serializeParams = (obj, prefix) => {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
              v = obj[p];
          str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
}

export const getTime = (date, options) => {
  return date.toLocaleTimeString('en-US', options);
}

export const getDate = (date, options) => {
  return date.toLocaleDateString(undefined, options);
}