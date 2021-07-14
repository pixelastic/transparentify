const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');
const { got } = require('golgoth');
const { remove, exist, absolute } = require('firost');

module.exports = {
  async run(filepath, options = {}) {
    const absoluteFilepath = absolute(filepath);
    if (!(await exist(absoluteFilepath))) {
      throw new Error(`The specified file do not exist: ${absoluteFilepath}`);
    }
    const photoroomUrl = 'https://sdk.photoroom.com/v1/segment';
    const apiKey = options.apiKey || process.env.PHOTOROOM_API_KEY;

    if (!apiKey) {
      throw new Error('You need to specify a PhotoRoom API key');
    }

    const form = new FormData();
    form.append('image_file', fs.createReadStream(absoluteFilepath));

    const response = await got.post(photoroomUrl, {
      headers: {
        'x-api-key': apiKey,
      },
      responseType: 'buffer',
      body: form,
    });

    if (!response.body) {
      throw new Error('Unable to process PhotoRoom API request');
    }

    const extname = path.extname(filepath);
    const downloadPath = filepath.replace(extname, '.png');
    if (downloadPath === absoluteFilepath) {
      await remove(filepath);
    }
    await fs.writeFile(downloadPath, response.body);
  },
};
