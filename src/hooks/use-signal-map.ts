
export const useSignalMap = () => {
  const entropyLevel = ['online', 'degraded', 'offline'][Math.floor(Math.random() * 3)] as const;
  const accessLevel = ['online', 'degraded', 'offline'][Math.floor(Math.random() * 3)] as const;

  return { entropyLevel, accessLevel };
};
