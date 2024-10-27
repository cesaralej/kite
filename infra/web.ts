import { api } from "./api";
import { wsapi } from "./websocket";
import { bucket } from "./storage";
import { userPool, identityPool, userPoolClient } from "./auth";

const region = aws.getRegionOutput().name;

export const frontend = new sst.aws.StaticSite("Frontend", {
  path: "packages/frontend",
  build: {
    output: "dist",
    command: "npm run build",
  },
  environment: {
    VITE_REGION: region,
    VITE_API_URL: api.url,
    VITE_WS_API_URL: wsapi.url,
    VITE_BUCKET: bucket.name,
    VITE_USER_POOL_ID: userPool.id,
    VITE_IDENTITY_POOL_ID: identityPool.id,
    VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
  },
  domain: {
    name: "www.comkite.com",
    dns: false,
    cert: "arn:aws:acm:us-east-1:376129882365:certificate/c2879544-e6fa-413e-b3b7-c12b180e30d1",
  },
});
