const os = require('os');
const path = require('path');

const tc = require('@actions/tool-cache');
const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');

const androidSDKRoot = '/usr/local/lib/android/sdk';
const platform = os.platform();
const version = core.getInput('ndk-version', { required: true });

async function run() {
  const system = (function() { switch(platform) {
    case 'linux':
      return 'linux';
    case 'darwin':
      return 'darwin';
    case 'win32':
      return 'windows';
    default:
      throw new Error(`Unexpected OS ${platform}`);
  }})();

  const filename = `android-ndk-${version}-${system}-x86_64`;
  const url = `https://dl.google.com/android/repository/${filename}.zip`;
  const downloadedPath = await tc.downloadTool(url);
  const extractedPath = await tc.extractZip(downloadedPath);

  const bundlePath = `${androidSDKRoot}/ndk-bundle`;
  await io.rmRF(bundlePath);
  await io.mv(path.join(`${extractedPath}`, `android-ndk-${version}`), bundlePath);
}

run().catch(function(e) {
  core.setFailed(`Action failed with error: ${e}`);
});
