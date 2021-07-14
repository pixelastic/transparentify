const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');
const { got } = require('golgoth');
const { remove, exist, absolute } = require('firost');

module.exports = {
  async run(filepath, options = {}) {
    const input = absolute(filepath);
    const destination =
      options.destination || filepath.replace(path.extname(input), '.png');

    // Check that input exists
    if (!(await exist(input))) {
      throw new Error(`The specified file do not exist: ${input}`);
    }

    // Check API key
    const apiKey = options.apiKey || process.env.PHOTOROOM_API_KEY;
    if (!apiKey) {
      throw new Error('You need to specify a PhotoRoom API key');
    }

    // Request the API
    const photoroomUrl = 'https://sdk.photoroom.com/v1/segment';
    const form = new FormData();
    form.append('image_file', fs.createReadStream(input));
    const response = await got.post(photoroomUrl, {
      headers: {
        'x-api-key': apiKey,
      },
      responseType: 'buffer',
      body: form,
    });

    // Check that response is valid
    if (!response.body) {
      throw new Error('Unable to process PhotoRoom API request');
    }

    if (input === destination) {
      await remove(input);
    }
    if (await exist(destination)) {
      await remove(destination);
    }

    await fs.writeFile(destination, response.body);
  },
};
