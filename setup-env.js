import fs from 'fs';
import path from 'path';

const workspaces = ['backend', 'frontend'];

workspaces.forEach(workspace => {
  const examplePath = path.join(workspace, '.env.example');
  const envPath = path.join(workspace, '.env');

  if (fs.existsSync(examplePath)) {
    if (!fs.existsSync(envPath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log(`Created .env for ${workspace}`);
    } else {
      console.log(`.env already exists in ${workspace}, skipping.`);
    }
  } else {
    console.log(`No .env.example found in ${workspace}`);
  }
});