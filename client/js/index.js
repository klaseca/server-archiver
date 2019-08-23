import { createFileList } from './createElement.js';

async function fetchPost(path) {
    const rawResponse = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `url=${encodeURIComponent(path)}`
    });
    const content = await rawResponse.json();

    const result = JSON.parse(content);

    createFileList(result, fetchPost, path);
}

fetchPost('/files');