class GraphF1UI {
    // Текущий номер диаграммы.
    #i = 0;
    legend = [];
    constructor(){
        this.data = [25, 30, 42];
        this.canvas = document.querySelector('#graph').getContext("2d");
        this.graph = new Graph(this.canvas, this.data, this.legend);
        this.showAllDiagrams();
    }
    
    
    addListeners(){
        // Загрузить результаты пилотов из файла, отрисовать диаграмму для первого.
        document.querySelector("#openFile").addEventListener("input", e => {
            new FS().loadFile(e.target.files[0]).then(
                result => {
                    this.data = result.split("\r\n").map(racer => {
                        racer = racer.split(/,\s*/);
                        this.legend.push(racer.shift());
                        return racer.map(Number);
                    });
                    this.graph.data = this.data[0];
                    this.graph.legend = this.legend[0];
                    this.showAllDiagrams();
                }
            );
        });

        document.querySelector("#calculate").addEventListener("click", this.calculate);

        // Отрисовать диаграмму для следующего пилота.
        document.querySelector("#nextGraph").addEventListener("click", () =>{
            ++this.#i;
            if(this.#i >= this.data.length)
                this.#i = 0;
            this.graph.data = this.data[this.#i];
            this.graph.legend = this.legend[this.#i];
            this.showAllDiagrams();
        });
        // Отрисовать диаграмму для предыдущего пилота.
        document.querySelector("#previousGraph").addEventListener("click", () =>{
            --this.#i;
            if(this.#i < 0)
                this.#i = this.data.length - 1;
            this.graph.data = this.data[this.#i];
            this.graph.legend = this.legend[this.#i];
            this.showAllDiagrams();
        });
    }

    // Отрисовать все доступные диаграммы.
    showAllDiagrams(){
        this.graph.clearCanvas();
        this.graph.showBarChart();
        this.graph.showTrendLine();
        this.graph.showDataPoints();
    }
}

class Graph {
    constructor(block, data, legend = []){
        this.canvas = block;
        this.data = data;
        this.legend = legend;
        // Настройки отображения: отступ между столбцами диаграммы, ширина столбцов, 
        // цвета столбцов, добавить подписи над столбцами, радиус точек данных, 
        // растяжение вдоль вертикальной оси, нижняя граница диаграммы.
        this.settings = {
            barOffset: 10,
            barWidth: 100,
            barColor: ["red", "orange", "yellow", "green", "blue", "purple"],
            isBarSign: true,
            pointRadius: 5,
            multiplication: 10.5,
            canvasBottom: 500
        }

    }

    // Построить столбчатую диаграмму.
    showBarChart(){
        const bottom = this.settings.canvasBottom,
            width = this.settings.barWidth,
            offset =  this.settings.barOffset,
            muliplex = this.settings.multiplication,
            isSign = this.settings.isBarSign,
            isName = this.settings.isBarName,
            canvas = this.canvas;
        let coordX = offset;
        
        this.showLegend();
        this.data.forEach(height => {
            let coordY = bottom - height * muliplex;
            canvas.fillStyle = this.settings.barColor[4];
            if(isSign){
                canvas.font = "12px serif";
                canvas.fillText(height.toFixed(), coordX + width / 2, coordY - 10);
            }
                
            canvas.fillRect(coordX, coordY, width, height * muliplex);
            coordX += width + offset;
        });
    }

    // Получить точки данных на графике.
    showDataPoints(){
        const offset = this.settings.barOffset + this.settings.barWidth,
            bottom = this.settings.canvasBottom,
            radius = this.settings.pointRadius,
            muliplex = this.settings.multiplication,
            fullCircle = 2 * Math.PI,
            canvas = this.canvas;
        let coordX = this.settings.barOffset + this.settings.barWidth / 2;
        
        this.data.forEach((value, i) => {
            canvas.fillStyle = "black";
            canvas.beginPath();
            canvas.arc(coordX,
                        bottom - value * muliplex,
                        radius, 0, fullCircle);
            canvas.fill();
            coordX += offset;
        });
    }

    // Получить линию тренда.
    showTrendLine(){
        const count = this.data.length,
            canvas = this.canvas,
            trend = new Statistics(this.data).getTrendLine(),
            k = trend.k, b = trend.b;
        // Нарисовать линию тренда по двум точкам.
        const x1 = this.settings.barOffset,
            y1 = this.settings.canvasBottom - (k + b) * this.settings.multiplication,
            x2 = count * (this.settings.barWidth + x1),
            y2 = this.settings.canvasBottom -  (k * count + b) * this.settings.multiplication;
        canvas.strokeStyle = "red";
        canvas.lineWidth = "3";
        canvas.beginPath();
        canvas.moveTo(x1, y1);
        canvas.lineTo(x2, y2);
        canvas.stroke();
        console.log(`y = ${k}*x + ${b}`);
        console.log(x1, y1, x2, y2);
    }

    // Очистить область диаграмм.
    clearCanvas(){
        this.canvas.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
    }

    showLegend(){
        if(this.legend.length !== 0){
            const canvas = this.canvas;
            canvas.font = "bold 48px serif";
            canvas.fillStyle = "red";
            canvas.beginPath();
            canvas.fillText(this.legend, 
                    canvas.canvas.width * 2 / 3, 
                    this.settings.canvasBottom / 6);
            canvas.strokeStyle = "black";
            canvas.lineWidth = 1;
            canvas.strokeText(this.legend, 
                    canvas.canvas.width * 2 / 3, 
                    this.settings.canvasBottom / 6);
        }
    }
}