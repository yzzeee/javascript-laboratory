const ip_array_from_long = array =>
  lodash.map(array, r => {
    if (lodash.includes(r, '-')) {
      const parsed = lodash.split(r, '-');
      return `${ip.fromLong(parsed[0])}-${ip.fromLong(parsed[1])}`;
    } else {
      return `${ip.fromLong(r)}`;
    }
  });

const ip_array_to_long = array => {
  const obj = ip.cidrSubnet(array);
  return `${ip.toLong(obj['networkAddress'])}-${ip.toLong(
    obj['broadcastAddress']
  )}`;
};

const ip_address_range_filter = () =>
  fxjs.pipe(
    _ => {
      console.log(_);
      return _;
    },
    C.map(arg => ipAddressToLong(arg)),
    arg => {
      console.log(arg);
      return rangesFilter(arg);
    },
    arg => ip_array_from_long(arg)
  );
