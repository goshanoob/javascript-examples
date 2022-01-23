

class Information {
	constructor(){
		// Информация о гонках от сервера.
		this.raceInfo = "";
		// Идентификаторы практик для запросов. 
		this.practiceId = [];
		// Идентификаторы кавалификаций для запросов.
		this.qualificationsId = [];
		// 
		this.bestLapsId = [];
		// Информация о практиках от сервера.
		this.practiceResponse = []; 
		// Информация о квалификациях от сервера.
		this.qualificationsResponse = [];
		this.bestLapsResponse = [];
		
	}
	// Ключ для запросов к серверу.
	token = "d856021dd7msh91fe8ddaf80c509p1b4eb7jsn4ac6c589a80b";
	// Получить информацию о гонках из файла.
	getIdFromFile(file){
		const fs = new FS();
		this.raceInfo = fs.readFile(file, callback);
	}
	// Сохранить информацию о гонках в файл.
	saveIdToFile(text){
		const fs = new FS();
		saveFile(text, "");
	}
	// Получить id сессий сезона.
	requestId(callback){
		this.makeRequest(
			"https://f1-live-motorsport-data.p.rapidapi.com/races/2021",
			e => {
				this.raceInfo = e;
				this.getId(callback);
			}
		);
	}
	// Выделить идентификаторы практик и квалификаций из ответа сервера.
	getId(callback){
		JSON.parse(this.raceInfo).results.forEach(element => {
			if(element.status === "Complete"){
				element.sessions.forEach(elem => {
					if(elem.session_name === "Practice 3")
						this.practiceId.push(elem.id);
					if(elem.session_name === "Qualifying 3")
						this.qualificationsId.push(elem.id);
					if(elem.session_name === "FastestLap")
						this.bestLapsId.push(elem.id);
				});
			}
		});
		callback(this);
	}
	// Выполнить последовательность запросов к серверу для получения информации о нужных сессиях.
	makeRequestsForStats(e){
		const link = "https://f1-live-motorsport-data.p.rapidapi.com/session/";
		for(let i = 0, count = e.practiceId.length; i < count; i++){
			e.makeRequest(link + e.practiceId[i], data => e.practiceResponse.push(data));
			e.makeRequest(link + e.qualificationsId[i], data => e.qualificationsResponse.push(data));
			e.makeRequest(link + e.bestLapsId[i], data => e.bestLapsResponse.push(data));
		}
		e.getDataFromResponses();
	}
	// Функция, реализующая запросы к серверу.
	makeRequest(url, callback){
		const xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.addEventListener("readystatechange", e => {
			if(e.target.readyState === e.target.DONE) {
				console.log(e.target.responseText);
				callback(e.target.responseText);
			}
		});
		xhr.open("GET", url, false);
		xhr.setRequestHeader("x-rapidapi-key", this.token);
		xhr.setRequestHeader("x-rapidapi-host", "f1-live-motorsport-data.p.rapidapi.com");
		xhr.send(null);
	}
	
	getDataFromResponses(){
		const practiceResults = {}, qualificationsResults = {}, bestLapsResults = {};
		for(let i = 0, count = this.practiceResponse.length; i < count; i++){
			JSON.parse(this.practiceResponse[i]).results.drivers.forEach(
				(element, i) => {
					if(!practiceResults.hasOwnProperty(element.name)){
						practiceResults[element.name] = this.getPoints(element.position);
					} else {
						practiceResults[element.name] += "," + this.getPoints(element.position);
					}
				}
			);
			JSON.parse(this.qualificationsResponse[i]).results.drivers.forEach(
				(element, i) => {
					if(!qualificationsResults.hasOwnProperty(element.name)){
						qualificationsResults[element.name] = this.getPoints(element.position);
					} else {
						qualificationsResults[element.name] += "," + this.getPoints(element.position);
					}
				}
			);
			JSON.parse(this.bestLapsResponse[i]).results.drivers.forEach(
				(element, i) => {
					if(!bestLapsResults.hasOwnProperty(element.name)){
						bestLapsResults[element.name] = this.getPoints(element.position);
					} else {
						bestLapsResults[element.name] += "," + this.getPoints(element.position);
					}
				}
			);
		}
		document.getElementById("practicePoints").value = JSON.stringify(practiceResults).replace(/{?"/g,"").replace(/:/g,",").replace("}","").replace(/,([A-Z])/g,'\n$1');
		document.getElementById("qualificationsPoints").value = JSON.stringify(qualificationsResults).replace(/{?"/g,"").replace(/:/g,",").replace("}","").replace(/,([A-Z])/g,'\n$1');
		document.getElementById("bestLapsPoints").value = JSON.stringify(bestLapsResults).replace(/{?"/g,"").replace(/:/g,",").replace("}","").replace(/,([A-Z])/g,'\n$1');
	}
	
	getPoints(parametr){
		var points = 0;
		switch(parametr){
			case 1: points = 25; break;
			case 2: points = 18; break;
			case 3: points = 15; break;
			case 4: points = 12; break;
			case 5: points = 10; break;
			case 6: points = 8; break;
			case 7: points = 6; break;
			case 8: points = 4; break;
			case 9: points = 2; break;
			case 10: points = 1; break;
		}
		return points;
	}
	
	testRequest(){
		const xhr = new XMLHttpRequest();
		xhr.withCredentials = true;
		xhr.addEventListener("readystatechange", () => {
			if(this.readyState === this.DONE) {
				console.log(this.responseText);
				return this.responseText;
			}
		});
		xhr.open("GET", "https://f1-live-motorsport-data.p.rapidapi.com/races/2021", false);
		xhr.setRequestHeader("x-rapidapi-key", "d856021dd7msh91fe8ddaf80c509p1b4eb7jsn4ac6c589a80b");
		xhr.setRequestHeader("x-rapidapi-host", "f1-live-motorsport-data.p.rapidapi.com");
		xhr.send(null);
		
		
	}
}


