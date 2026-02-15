const calcRemainingTime = (time) => {
  const now = new Date().getTime();
  const targetTime = new Date(time).getTime();
  return targetTime - now;
};

export { calcRemainingTime };
