// Класс для работы с файламы. Метод readFile() принимает файл для чтения и функцию обратного вызова, 
// saveFile() сохраняет файл в загрузки браузера.
class FS {
	// Читать файл. Метод, принимает файл для чтения и функцию обратного вызова.
	readFile(file, callback) {
		let reader = new FileReader();
		reader.readAsText(file);
		reader.onload = callback;
		reader.onerror = () => {
			console.log("Ошибка чтения файла", file);
		}
	}
	// Прочитать файл. Метод возвращает промис.
	loadFile(file){
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = () => reject(new Error("Ошибка чтения файла"));
		});
	  }
	// Сохранить файл. Метод помещает файл в загрузки браузера.
	saveFile(content, filename, contentType = "text/plain"){
		const a = document.createElement('a');
		const file = new Blob([content], {type: contentType});
		a.href= URL.createObjectURL(file);
		a.download = filename;
		a.click();
		URL.revokeObjectURL(a.href);
	}
}