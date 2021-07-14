const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');
const { got } = require('golgoth');
const { remove, exist } = require('firost');

module.exports = {
  async run(filepath, options = {}) {
    if (!(await exist(filepath))) {
      throw new Error(`The specified file do not exist: ${filepath}`);
    }
    const photoroomUrl = 'https://sdk.photoroom.com/v1/segment';
    const apiKey = options.apiKey || process.env.PHOTOROOM_API_KEY;

    if (!apiKey) {
      throw new Error('You need to specify a PhotoRoom API key');
    }

    const form = new FormData();
    form.append('image_file', fs.createReadStream(filepath));

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
    await remove(filepath);
    await fs.writeFile(downloadPath, response.body);
  },
};
