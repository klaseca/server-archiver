const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const app = express();
const indexHTML = path.resolve(__dirname, '../client/index.html');

app.use(express.urlencoded());

app.get('/', (req, res) => {
	res.sendFile(indexHTML);
});

app.post('/', (req, res) => {
	const url = req.body.url;
	const arrFiles = [];
	const pathUrl = path.resolve(__dirname, `../client/${url}`);

	fs.readdir(pathUrl, (err, files) => {
		files.forEach(file => {
			const pathFile = path.join(pathUrl, file);

			const fileStat = fs.statSync(pathFile);

			const type = fileStat.isDirectory() ? 'dir' : 'file';

			const icon =
				type == 'dir'
					? 'https://img.icons8.com/bubbles/50/000000/opened-folder.png'
					: 'https://img.icons8.com/bubbles/50/000000/document.png';

			arrFiles.push({
				name: file,
				path: url,
				iconSrc: icon,
				type: type
			});
		});

		arrFiles.sort((a, b) => {
			if (a.type > b.type) return 1;
			if (a.type < b.type) return -1;
			return 0;
		});

		const json = JSON.stringify(arrFiles);

		res.json(json);
	});
});

app.get('/download', (req, res) => {
	const url = req.query.url;
	const pathUrl = path.resolve(__dirname, `../client/${url}`);

	const typeFile = req.query.type;

	const archive = archiver('zip', {
		zlib: {
			level: 9
		}
	});

	archive.pipe(res);

	if (typeFile == 'dir') {
		const fileName = url.split('/').pop();

		res.writeHead(200, {
			'Content-Type': 'application/zip',
			'Content-disposition': `attachment; filename=${fileName}.zip`
		});

		archive.directory(pathUrl, false);
		archive.finalize();
	} else {
		const fileName = url.split('/').pop();
		const zipName = fileName.split('.')[0];

		res.writeHead(200, {
			'Content-Type': 'application/zip',
			'Content-disposition': `attachment; filename=${zipName}.zip`
		});

		archive.file(pathUrl, { name: fileName });
		archive.finalize();
	}
});

app.use(express.static(path.resolve(__dirname, '../client')));
app.use('/files', express.static(path.resolve(__dirname, '../client/files')));

app.listen(5000, () => console.log('Server working'));
