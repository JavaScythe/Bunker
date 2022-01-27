var r = document.querySelector(':root');
if(localStorage.s_thm!=undefined){
	r.style.setProperty("--theme", localStorage.s_thm);
} else {
	r.style.setProperty("--theme", "dark");
}