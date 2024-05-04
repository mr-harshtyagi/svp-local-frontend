export const getTempData = () => {
  let tempData = [];
  for (let a = 0; a < 100; a++) {
    let reading = 0;
    tempData.push({ temp: reading });
  }

  return tempData;
};

export const getAccData = () => {
  let accData = [];
  for (let a = 0; a < 100; a++) {
    let reading = 0;
    accData.push({ time: `${a + 1}`, acceleration: reading });
  }

  return accData;
};
