if(localStorage.s_thm != undefined){
	var c = document.createElement("link");
	c.href=window.pathDepth+"css/ui-"+localStorage.s_thm+".css";
	c.setAttribute("rel", "stylesheet");
	document.head.appendChild(c);
	delete c;
} else {
	var c = document.createElement("link");
	c.href=window.pathDepth+"css/ui-dark.css";
	c.setAttribute("rel", "stylesheet");
	document.head.appendChild(c);
	delete c;
}