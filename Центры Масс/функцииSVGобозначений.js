	function drawLine(){
		var telo0 = document.getElementById('тело_0');
		for(var i=0; i<arguments.length; i+=2){
		if(document.getElementById("line"+i)){
			document.getElementById("line"+i).remove();
			document.getElementById("cm"+i).remove();
		}
		
		var path = document.createElementNS("http://www.w3.org/2000/svg", 'path'); 
		var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); 
		var x = (arguments[i][0]+arguments[i+1][0])/2, y = (arguments[i][1]+arguments[i+1][1])/2; // координаты середины отреза
		path.setAttribute("d","M "+arguments[i][0]+" "+arguments[i][1]+" L "+arguments[i+1][0]+" "+arguments[i+1][1]);
		path.setAttribute("stroke","red");
		path.setAttribute("id","line"+i);
		telo0.appendChild(path);
		// точка в середине отрезка
		circle.setAttribute("id","cm"+i);
		circle.setAttribute("r","5");
		circle.setAttribute("cx",x);
		circle.setAttribute("cy",y);
		telo0.appendChild(circle);
		}
	}
	
	function setMassCenter(){
		for(var i=1; i<=N; i++){
			var telo = document.getElementById("тело_"+i);
			if(telo.getAttribute("ЦМ")){
				var cm = telo.getAttribute("ЦМ").split(",");
				CM[i] = [parseFloat(cm[0]), parseFloat(cm[1])];
			} else {
				var points = telo.getElementsByTagName("path")[0].getAttribute("d").match(/-?\d+/g);
				for(var j = 0; j<4; j++){
					points[j] = parseFloat(points[j]);
				}
				CM[i] = [(points[0]+points[2])/2,(points[1]+points[3])/2];
			}
			var massCenter = document.createElementNS("http://www.w3.org/2000/svg", 'path');
			massCenter.setAttribute("d","m"+(CM[i][0]-5)+","+(CM[i][1]-5)+" l 10,10 m0,-10 l-10,10");
			massCenter.setAttribute("stroke","red");
			telo.appendChild(massCenter);
		}
	}
	
	function move(){
		var n = this.id.replace(/\D/g,"");
		var value = this.value;
		var telo = document.getElementById("тело_"+n);
		var trans = telo.getAttribute("transform");
		var axis = telo.getAttribute("осьКП");
		if(telo.getAttribute("видКП")=="ВКП"){
			if(axis==="Z"){
				telo.setAttribute("transform", trans.replace(/rotate\(-?\d+\)/,"rotate("+value+")"));
			}
		} else {
			var t = trans.match(/translate\((.*?)\)/)[1].split(",");
			switch(axis){
				case "X": t[0] = value; break;
				case "Y": t[1] = value; break;
				case "Z": ; break;
			}
			telo.setAttribute("transform", trans.replace(/translate\(.*?\)/,"translate("+t.join(",")+")"));
		}
		document.getElementsByTagName("span")[0].innerHTML = value;
		calculCoord();
	}
	
	function makePolz(){
		for(var i=0; i< N; i++){
			var inp = document.createElement("input");
			inp.id="polz_"+(i+1);
			inp.type = "range";
			inp.step="10";
			inp.min="-100"; inp.max="260";
			document.body.appendChild(inp);
			inp.addEventListener("input", move);
			
		}
	}
	
	Number.prototype.makeRound = function(p){
		if(p===undefined){
			p = 100;
		} else {
			p = Math.pow(10,p);
		}
		return Math.round(p * this )/p;
	}
	
