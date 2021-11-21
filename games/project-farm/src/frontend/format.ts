export const toMinutesSeconds = (milliseconds: number) => {
  const seconds = Math.round(milliseconds / 1000);
  return `${seconds > 60 ? `${Math.floor(seconds / 60)} minutes ` : ' '}${
    seconds % 60
  } seconds`;
};
