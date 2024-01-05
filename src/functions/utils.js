export function truncateAddress(address, startLength = 6, endLength = 4) {
  if (!address) {
    return "";
  }
  const truncatedStart = address.substr(0, startLength);
  const truncatedEnd = address.substr(-endLength);

  return `${truncatedStart}...${truncatedEnd}`;
}

export function timeSince(date) {
  var seconds = Math.floor(Date.now() / 1000 - date);

  var interval = seconds / 31536000;

  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + " year";
    } else {
      return Math.floor(interval) + " years";
    }
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + " month";
    } else {
      return Math.floor(interval) + " months";
    }
  }
  interval = seconds / 86400;
  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + " day";
    } else {
      return Math.floor(interval) + " days";
    }
  }
  interval = seconds / 3600;
  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + " hr";
    } else {
      return Math.floor(interval) + " hrs";
    }
  }
  interval = seconds / 60;
  if (interval > 1) {
    if (Math.floor(interval) === 1) {
      return Math.floor(interval) + " min";
    } else {
      return Math.floor(interval) + " mins";
    }
  }
  if (Math.floor(interval) === 1) {
    return Math.floor(interval) + " sec";
  } else {
    return Math.floor(interval) + " secs";
  }
}
