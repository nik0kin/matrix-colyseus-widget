
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomBoolean(): boolean {
  return getRandomInt(0, 1) === 0;
}

export function getRandomArrayElement<T>(array: T[]): T {
  return array[getRandomInt(0, array.length - 1)];
}

export function getSeededRandomNumber(min: number, max: number, seed: string) {
  return (
    ((seed.split('').reduce((total: number, next: string): number => {
      return next.charCodeAt(0);
    }, 0) *
      seed.charCodeAt(0)) %
      (max - min + 1)) +
    min
  );
}

export function shuffleArray<T>(array: T[]) {
  const arr = [...array];
  var currentIndex = arr.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}
