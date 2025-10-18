export function createLimiter(limit: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  const next = () => {
    active--;
    queue.shift()?.();
  };

  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    await new Promise<void>((resolve) => {
      const start = () => {
        if (active < limit) {
          active++;
          resolve();
        } else {
          queue.push(start);
        }
      };
      start();
    });

    try {
      return await fn();
    } finally {
      next();
    }
  };
}

export const runLimited = createLimiter(3);
