/**
 * @param objects IP List가 포함 되어있는 객체
 * @param key : IP List가 들어있는 프로퍼티 명
 * @param id : 식별키
 * @param name : 이름
 */
export const convertObjectsInnerIpList = (objects, key, id, name) => {
  let i = 0;
  console.time();
  return fxjs.go(
    objects,
    C.map((o) => {
      let errors = []; // 전달된 IP가 유효하지 않다면 에러 메시지 저장할 배열

      const ipList = o[key];
      const filteredIpList = ipListFilter(
        lodash.isString(ipList) ? lodash.split(ipList, "\n") : ipList,
        i,
        errors
      );

      // 범위 형태 IP와 단일 형태의 IP를 그룹으로 나눔
      const group = lodash.groupBy(
        lodash.uniq(lodash.compact(filteredIpList)),
        (c) => (lodash.includes(c, "-") ? "ranges" : "singles")
      );

      group["id"] = o[id];
      group["name"] = o[name];
      group["index"] = i++;

      let host_count = 0; // 해당 ip(ranges, singles)에 속하는 전체 호스트 카운트 변수

      if (group["ranges"]) {
        group["ranges"] = rangesFilter(group["ranges"]);
        group["ranges_readable"] = ip_array_from_long(group["ranges"]);
        host_count =
          host_count +
          lodash.reduce(
            group["ranges"],
            (acc, range) => {
              const parsed = lodash.split(range, "-");
              return acc + (Number(parsed[1]) - Number(parsed[0]) + 1);
            },
            0
          );
      } else {
        group["ranges"] = [];
        group["ranges_readable"] = [];
      }

      if (group["singles"]) {
        group["singles"] = singlesFilter(group["singles"], group["ranges"]);
        group["singles_readable"] = ip_array_from_long(group["singles"]);
        host_count = host_count + group["singles"].length;
      } else {
        group["singles"] = [];
        group["singles_readable"] = [];
      }

      // 호스트 수 저장
      group["host_count"] = host_count;

      console.log("===> ", i);
      if (i == objects.length) {
        console.timeEnd();
      }
      return {
        ...o,
        converted_ip_addresses: group,
        errors,
      };
    }),
    fxjs.takeAll
  );
};

/**
 * @param comparableFirewallList IP List가 포함 되어있는 객체
 * @param inventoryObjectGroupByZone : IP List가 들어있는 프로퍼티 명
 */
const findMatchedInventoryObject = (
  comparableFirewallList,
  inventoryObjectGroupByZone
) => {
  return fxjs.go(
    comparableFirewallList,
    C.map((f) => {
      const zone = firewall["zone"];
      return inventoryObjectGroupByZone[zone];
    }),
    (inventoryGroups) =>
      fxjs.go(
        inventoryGroups,
        C.map((inventoryObject) => {
          return getConvertedIpAddress(inventoryObject);
        })
      ),
    (comvertedIpAddresses) => {
      let index = 0;
      return lodash.map(comvertedIpAddresses, (convertedIpAddress) => {
        const target = comparableFirewallList[index++];

        const filteredByHostCountIpAddresses = lodash.filter(
          convertedIpAddress,
          (ipInfo) => {
            return target.host_count === ipInfo.host_count;
          }
        );

        const targetIps = [...target["ranges"], ...target["singles"]];

        console.group(`★  ${index - 1}  ★`, targetIps, targetIps.length);
        console.dir(filteredByHostCountIpAddresses);
        console.groupEnd();

        if (lodash.isEmpty(filteredByHostCountIpAddresses)) {
          return {};
        }

        const res = fxjs.go(
          filteredByHostCountIpAddresses,
          (_) => {
            console.time();
            return _;
          },
          L.map((filteredIp) => {
            console.log(filteredByHostCountIpAddresses);
            // console.log(filteredIp, filteredIp["ranges"], filteredIp["singles"]);
            const filteredRanges = filteredIp["ranges"];
            const filteredSingles = filteredIp["singles"];

            if (filteredIp["host_count"] === 1) {
              if (filteredSingles[0] == targetIps[0]) {
                return inventoryObjectGroupByCredential[
                  firewallList[target["index"]]["zone"]
                ][filteredIp["index"]];
              }
              return {};
            }

            const targetMap = lodash.map(targetIps, (t) => {
              if (lodash.includes(t, "-")) {
                const parsedTargetIp = lodash.split(t, "-");
                const range = parsedTargetIp[1] - parsedTargetIp[0] + 1;

                if (lodash.includes(filteredRanges, t)) {
                  // 범위 아이피와 비교하여 동일한 값 있는지 확인
                  return true;
                }

                let ok = lodash.some(filteredRanges, (r) => {
                  // 범위 아이피 내에 속하는지 확인
                  const parsedFilteredIp = lodash.split(r, "-");
                  if (
                    parsedTargetIp[0] >= parsedFilteredIp[0] &&
                    parsedTargetIp[1] <= parsedFilteredIp[1]
                  ) {
                    return true;
                  }
                });

                if (
                  lodash.includes(filteredSingles, parsedTargetIp[0]) &&
                  lodash.includes(filteredSingles, parsedTargetIp[1])
                ) {
                  const startIndex = lodash.findIndex(
                    filteredSingles,
                    (c) => c === parsedTargetIp[0]
                  );
                  const endIndex = lodash.findIndex(
                    filteredSingles,
                    (c) => c === parsedTargetIp[1]
                  );

                  if (
                    lodash
                      .cloneDeep(filteredSingles)
                      .splice(startIndex, endIndex).length === range
                  ) {
                    return true;
                  }
                }

                if (ok) {
                  return true;
                }
              } else {
                if (lodash.includes(filteredSingles, t)) {
                  // 단일 아이피와 비교
                  return true;
                } else {
                  // 범위 아이피와 비교
                  let ok = lodash.some(filteredRanges, (r) => {
                    // 범위 아이피 내에 속하는지 확인
                    const parsedFilteredIp = lodash.split(r, "-");

                    if (t >= parsedFilteredIp[0] && t <= parsedFilteredIp[1]) {
                      return true;
                    }
                  });

                  if (ok) {
                    return ok;
                  }
                }
              }
            });

            if (targetIps.length === lodash.compact(targetMap).length) {
              return inventoryObjectGroupByCredential[
                firewallList[target["index"]]["zone"]
              ][filteredIp["index"]];
            }
          }),
          L.filter((f) => !lodash.isEmpty(f)),
          fxjs.take1
        );

        if (index - 1 === filteredByHostCountIpAddresses.length) {
          console.timeEnd();
        }

        return !lodash.isEmpty(res) ? res[0] : {};
      });
    }
  );
};

const ipListFilter = (ipAddresses, i, errors) => {
  return fxjs.go(
    ipAddresses,
    L.map((ipAddress) => {
      try {
        console.log(`GROUP: ${i}, : IP: ${ipAddress}`);
        i++;
        return ipAddressToLong(ipAddress);
      } catch (e) {
        console.log(`ERROR! GROUP : ${i}, LOG: ${e}`);
        if (errors) {
          errors.push(`${ipAddress} => ${e}`);
        }
        return "";
      }
    }),
    L.compact,
    fxjs.uniq
  );
};

const ipAddressToLong = (ipAddress) => {
  console.group(` - ${ipAddress}`);
  console.log(
    `${lodash.join(
      lodash.map(lodash.split(ipAddress, "-"), (o) => ip.toLong(o)),
      "-"
    )}`
  );
  console.groupEnd();

  if (lodash.includes(ipAddress, "-")) {
    // 범위 형태 처리
    const parsedIp = lodash.split(ipAddress, "-");
    const prev = parsedIp[0];
    const next = parsedIp[1];

    if (parsedIp.length != 2) {
      throw new Error("범위 형태 입력 확인 필요");
    }

    if (!ipUtil.isValidIp(prev) || !ipUtil.isValidIp(next)) {
      throw new Error("입력 IP 확인 필요");
    }

    if (!ipUtil.isValidIpv4(prev) || !ipUtil.isValidIpv4(next)) {
      throw new Error("IPv6 Unsupported");
    }

    if (ip.toLong(prev) >= ip.toLong(next)) {
      throw new Error("입력 IP 범위 확인 필요");
    }

    return lodash.join(
      lodash.map(parsedIp, (o) => ip.toLong(o)),
      "-"
    );
  } else if (lodash.includes(ipAddress, "/")) {
    // cidr 형태 처리
    try {
      const obj = ip.cidrSubnet(ipAddress);

      if (obj["subnetMaskLength"] >= 32) {
        throw new Error("유효하지 않은 서브넷");
      }
      return `${ip.toLong(obj["firstAddress"])}-${ip.toLong(
        obj["lastAddress"]
      )}`;
    } catch (e) {
      throw new Error(e.message);
    }
  } else {
    if (!ipUtil.isValidIp(ipAddress)) {
      throw new Error("입력 IP 확인 필요");
    }

    if (!ipUtil.isValidIpv4(ipAddress)) {
      throw new Error("IPv6 Unsupported");
    }

    return ip.toLong(ipAddress);
  }
};

// long 형태로 변환된 IP 범위 배열
const rangesFilter = (ranges) => {
  const sortedRanges = lodash.sortBy(ranges);
  return (function recur(ranges) {
    const res = [ranges[0]];
    for (let i = 0; i < ranges.length - 1; i++) {
      const prev = lodash.split(ranges[i], "-");
      const next = lodash.split(ranges[i + 1], "-");

      if (ranges[i] === ranges[i + 1]) {
        if (!lodash.includes(res, ranges[i])) {
          res.push(ranges[i]);
        }
      } else if (prev[1] >= next[0]) {
        const resLast = lodash.split(res[lodash.findLastIndex(res)], "-");
        res[lodash.findLastIndex(res)] = `${
          prev[0] > resLast[0] ? resLast[0] : prev[0]
        }-${prev[1] > next[1] ? prev[1] : next[1]}`;
      } else {
        res.push(lodash.join(next, "-"));
      }
    }
    return res.length === ranges.length ? res : recur(lodash.sortBy(res));
  })(sortedRanges);
};

// long 형태로 변환된 IP 배열 전달
const singlesFilter = (singles, ranges) => {
  return lodash.sortBy(
    lodash.reject(singles, (single) => {
      let contain = false;
      lodash.each(ranges, (range) => {
        if (
          lodash.split(range, "-")[0] <= single &&
          single <= lodash.split(range, "-")[1]
        ) {
          contain = true;
        }
      });
      return contain;
    })
  );
};

// 변환된 아이피 중 에러가 없는 아이피만 반환
const comparableIpFilter = fxjs.pipe(
  L.filter((f) => lodash.isEmpty(f.errors)),
  C.map((f) => f.converted_ip_addresses)
);

const ip_array_from_long = (array) =>
  lodash.map(array, (r) => {
    if (lodash.includes(r, "-")) {
      const parsed = lodash.split(r, "-");
      return `${ip.fromLong(parsed[0])}-${ip.fromLong(parsed[1])}`;
    } else {
      return `${ip.fromLong(r)}`;
    }
  });

function ip_array_to_long(array) {
  const obj = ip.cidrSubnet(array);
  return `${ip.toLong(obj["networkAddress"])}-${ip.toLong(
    obj["broadcastAddress"]
  )}`;
}

const ip_address_range_filter = fxjs.pipe(
  (_) => {
    console.log(_);
    return _;
  },
  C.map((arg) => ipAddressToLong(arg)),
  (arg) => {
    console.log(arg);
    return rangesFilter(arg);
  },
  (arg) => ip_array_from_long(arg)
);
