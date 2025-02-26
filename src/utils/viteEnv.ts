type ImportMetaEnv = Record<string, string | undefined>;

const viteEnv = (envVars: string[]): string[] => {
  const env = import.meta.env as ImportMetaEnv;
  return envVars.map((varName): string => {
    const value = env[varName];
    if (value === undefined) {
      console.warn(`Warning: переменная окружения ${varName} не найдена`);
      return '';
    }
    return value;
  });
};

export default viteEnv;
