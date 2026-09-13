import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',fullyParallel:false,workers:1,timeout:15000,
  use:{baseURL:'http://127.0.0.1:4173',channel:'msedge',headless:true},
  webServer:{command:'npm.cmd start',url:'http://127.0.0.1:4173',reuseExistingServer:true},
  projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'portrait',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}]
});
