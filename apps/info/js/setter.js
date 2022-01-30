function handleSettings(){
	var sid = (this.id+"").replace("_c", "");
	localStorage[sid] = this.value;
	console.log(`SETTINGS: setting ${sid} to ${this.value}`);
	document.getElementById("info").textContent = "saving";
	setTimeout(function(){
		document.getElementById("info").textContent = "saved";
	}, 1000);
}
//settings MUST be prefixed with "s_"
const as = [
	"s_thm"
]
try{
	for(var i in as){
		console.log(Array.apply(null, document.getElementById(as[i]+"_c").options));
		console.log(as[i], localStorage[as[i]],  document.getElementById(as[i]+"_c").options);
		if(localStorage[as[i]] != undefined){
			document.getElementById(as[i]).textContent = localStorage[as[i]];
			var opts = (function(){
				var r = [];
				for(var b in Array.apply(null, document.getElementById(as[i]+"_c").options)){
					r.push(Array.apply(null, document.getElementById(as[i]+"_c").options)[b].value);
				}
				return r;
			})();
			document.getElementById(as[i]+"_c").selectedIndex = opts.indexOf(localStorage[as[i]]);
		}
		document.getElementById(as[i]+"_c").addEventListener("change", handleSettings);
	}
}catch(e){
	throw e;
}