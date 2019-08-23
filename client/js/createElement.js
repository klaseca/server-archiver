function createElement(tag, props, ...children) {
	const element = document.createElement(tag);

	Object.keys(props).forEach(key => (element[key] = props[key]));

	if (children.length > 0) {
		children.forEach(child => {
			if (typeof child === 'string') {
				child = document.createTextNode(child);
			}

			element.appendChild(child);
		});
	}

	return element;
}

function createFileItem(props) {
	const img = createElement('img', { src: props.iconSrc });
	const imgBox = createElement('div', { className: 'img-box' }, img);

	const fileName = createElement('div', { className: 'file-name' }, props.name);

	const info = createElement('div', { className: 'info' }, imgBox, fileName);

	const zipImg = createElement('img', {
		src: 'https://img.icons8.com/plasticine/40/000000/zip.png'
	});
	const zip = createElement('div', { className: 'zip' }, zipImg);

	zip.addEventListener('click', e => {
		e.stopPropagation();
		window.location = `http://localhost:3000/download?url=${encodeURIComponent(
			props.path
		)}/${encodeURIComponent(props.name)}&type=${encodeURIComponent(
			props.type
		)}`;
	});

	const fileItem = createElement('div', { className: 'file-item' }, info, zip);
	fileItem.dataset.path = props.path;
	fileItem.dataset.type = props.type;

	return fileItem;
}

function createBackFolder(props) {
	const img = createElement('img', { src: props.iconSrc });
	const imgBox = createElement('div', { className: 'img-box' }, img);

	const fileName = createElement('div', { className: 'file-name' }, props.name);

	const fileItem = createElement(
		'div',
		{ className: 'back-item' },
		imgBox,
		fileName
	);
	fileItem.dataset.path = props.path;
	fileItem.dataset.type = props.type;

	return fileItem;
}

export function createFileList(files, fetchPost, path) {
	const filesBox = document.querySelector('.files');
	filesBox.innerHTML = '';

	if (path !== '/files') {
		const pathArr = path.split('/');
		pathArr.splice(-1, 1);

		const url = pathArr.join('/');

		const backDir = {
			name: '...',
			path: url,
			iconSrc: 'https://img.icons8.com/bubbles/50/000000/opened-folder.png',
			type: 'dir'
		};

		const backDirItem = createBackFolder(backDir);

		backDirItem.addEventListener('click', e => {
			const pathFile = e.target.dataset.path;

			fetchPost(pathFile);
		});

		filesBox.appendChild(backDirItem);
	}

	if (files.length > 0) {
		files.forEach(fileProps => {
			const fileItem = createFileItem(fileProps);

			if (fileItem.dataset.type === 'dir') {
				fileItem.addEventListener('click', e => {
					const pathFile = e.target.dataset.path;
					const name = e.target.innerText;

					fetchPost(`${pathFile}/${name}`);
				});
			}

			filesBox.appendChild(fileItem);
		});
	}
}
