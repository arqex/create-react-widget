import {exec} from 'child_process';
import { test as setup, expect } from '@playwright/test';

setup('launch dev server', async ({page}) => {
  await launch();
  page.goto('http://localhost:5173');
  await expect(page).toHaveTitle('Create React Widget');
});


function launch() {
  const child = exec('./scripts/dev-tests-setup.sh');
  return new Promise<void>((resolve) => {
    child.stdout?.on('data', (data) => {
      // output stdout to console
      console.log(data);
      if(data.includes('ready')){
        resolve();
      }
    });
  });
}