function tickImport(){
	const input = document.querySelector('input[type="file"]');
	const file = input.files[0];
	const url = URL.createObjectURL(file);
	const size = document.getElementById("fsize").selectedIndex;
	initializeViewer(url,size);
}
function initializeViewer(url, size){
	if(size==0) size = "max-wdth";
	if(size==1) size = "yt-wdth";
	document.body.innerHTML = `
		<video class="${size}" controls>
			<source src="${url}">
		</video>
	`
}