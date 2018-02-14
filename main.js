var canvas=document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let height=canvas.height;
let width=canvas.width;
let totalPixels=height*width;

function scramble(text){
	let maxPixelsPerChar=Math.ceil((totalPixels-1)/text.length);
	let encodingBase=Math.ceil(Math.pow(256, 1/maxPixelsPerChar));
	let pixelsPerChar=Math.ceil(Math.log(256)/Math.log(encodingBase));

	renderImage();//Reset the alpha values
	setPixelAlpha(0, 0, encodingBase);
	for(var i=0; i<text.length; i++){
		let alpha = text.charCodeAt(i);
		for(let j=0; j<pixelsPerChar; j++){
			let position = 1 + i*pixelsPerChar + j;
			let x = position%width;
			let y = Math.floor(position/width);
			setPixelAlpha(x, y, alpha%encodingBase);
			alpha = Math.floor(alpha/encodingBase);
		}
	}
	function setPixelAlpha(x, y, alpha){
		let pixel = ctx.getImageData(x, y, 1, 1);
		pixel.data[3]=255-alpha;
		ctx.putImageData(pixel, x, y);
	}
}

function updateImage(file){
	var img= new Image();
	img.onload=function(){
		canvas.width=img.width;
		canvas.height=img.height;
		height=canvas.height;
		width=canvas.width;
		ctx.fillStyle="#FFFFFF";
		ctx.fillRect(0, 0, width, height);
		(renderImage=function(){ctx.drawImage(img, 0, 0);})();
		window.URL.revokeObjectURL(img.src);
		totalPixels=height*width;

	}
	img.src=window.URL.createObjectURL(file);
}

var renderImage=function(){}

function unscramble(){
	let encodingBase=getPixelAlpha(0,0);
	let pixelsPerChar=Math.ceil(Math.log(256)/Math.log(encodingBase));
	var message="";
	for(var i=1; i<totalPixels-pixelsPerChar; i+=pixelsPerChar){
		var ch=0;
		for(var j=0; j<pixelsPerChar; j++){
			ch+=getPixelAlpha((i+j)%width, Math.floor((i+j)/width))*Math.pow(encodingBase, j);
		}
		if(ch==0){
			break;
		}
		message+=String.fromCharCode(ch);
	}
	alert(message);
	function getPixelAlpha(x, y){
		return -(ctx.getImageData(x, y, 1, 1).data[3]-255);
	}
}
