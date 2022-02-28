chrome.browserAction.onClicked.addListener(function (tab) {
	var w = 800;
	var h = 550;
	var left = Math.round((screen.width / 5) - (w / 5));
	var top = Math.round((screen.height / 5) - (h / 5));

	chrome.windows.create({
		url : 'popup.html',
		width : w,
		height : h,
		focused : true,
		'left' : left,
		'top' : top,
		type : 'popup'
	});
});


