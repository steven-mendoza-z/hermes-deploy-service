// src/config/services.js
export const ENV_SERVER =
  // import.meta.env?.VITE_ENV_SERVER ||
  // process.env?.VITE_ENV_SERVER ||
  "prod";

// Base Domains
export const ACCOUNTS_API_DOMAIN = "accounts.hermes.purpleblue.site";
// const ACCOUNTS_API_DOMAIN = "localhost:8021";
export const DEPLOY_API_DOMAIN = "api.hermes.purpleblue.site";
// const DEPLOY_API_DOMAIN = "localhost:8021";

// Enviroment Routing
const SERVICES = {
  prod: {
    accounts:  `https://${ACCOUNTS_API_DOMAIN}`,
    deploy: `https://${DEPLOY_API_DOMAIN}`,
  },
  dev: {
    accounts:  `https://dev.${ACCOUNTS_API_DOMAIN}`,
    deploy: `https://dev.${DEPLOY_API_DOMAIN}`,
  },
  local: {
    accounts:  "http://127.0.0.1:8000",
    deploy: "http://127.0.0.1:8000",
  },
};

// Services URLs
export const ACCOUNTS_API_URL  = SERVICES[ENV_SERVER]?.accounts;
export const DEPLOY_API_URL = SERVICES[ENV_SERVER]?.deploy;

export const API_SERVICES = {
  env: ENV_SERVER,
  accounts:  ACCOUNTS_API_URL,
  deploy: DEPLOY_API_URL,
};
