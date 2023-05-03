export const flattenObj = (obj, parent, res = {}) => {
    try {
      for (const key of Object.keys(obj)) {
        const propName = parent ? parent + '.' + key : key;
        if (typeof obj[key] === 'object') {
          flattenObj(obj[key], propName, res);
        } else {
          res[propName] = obj[key];
        }
      }
    } catch (e) {
      // console.log(e);
    }
    console.log(res);
    return res;
  }
  
  export const returnShortAddress = (address) => {
    if (address)
      return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
  }
  
  export const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };