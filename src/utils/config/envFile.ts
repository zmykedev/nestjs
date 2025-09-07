import { environments } from '../../environments';

export const getEnvFilePath = () => {
  return (
    environments[process.env.NODE_ENV as keyof typeof environments] ?? '.env'
  );
};
