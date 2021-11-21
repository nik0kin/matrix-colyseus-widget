import { formatDuration as _formatDuration } from 'date-fns';

export const formatDuration = (milliseconds: number) => {
  const totalSeconds = Math.round(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 60 / 60);

  if (hours > 0) {
    const minutes = Math.floor(totalSeconds / 60) % 60;
    return _formatDuration({
      hours,
      minutes,
    });
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return _formatDuration({
    minutes,
    seconds,
  });
};
