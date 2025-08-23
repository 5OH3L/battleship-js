function Ship(len) {
  if (!len) throw new Error("Ship length must be provided!");
  if (!Number.isInteger(len)) throw new Error("Ship length must be an integer");
  if (len < 2 || len > 5) throw new Error("Ship length must be between 2 - 5");
  const length = len;
  let hits = 0;
  let sunk = false;
  return {
    get length() {
      return length;
    },
    get hits() {
      return hits;
    },
    hit() {
      if (sunk) return hits;
      if (++hits >= length) sunk = true;
      return hits;
    },
    get sunk() {
      return sunk;
    },
  };
}

export default Ship;