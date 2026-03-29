class F1WebImporter {
    constructor() {
        this.f1Data = new F1Data();
    }

    init() {
        const btn = document.getElementById("downloadWebResults");
        
        if (btn) {
            btn.addEventListener("click", () => this.importAndDownload());
        }
    }

    async importAndDownload() {
        const url = prompt("Введите ссылку на результаты");
        
        if (!url) {
            return;
        }

        const loader = document.getElementById("webImporterLoader");
        loader.classList.remove("hidden");

        try {
            //const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            //const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

            const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`Ошибка прокси-сервера: ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder("windows-1251");
            const htmlText = decoder.decode(buffer);
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            const rows = doc.querySelectorAll("table tr");
            const results = [];

            for (let row of rows) {
                const cells = row.querySelectorAll("td");
                
                if (cells.length >= 4) {
                    const driverFullName = cells[2].innerText.trim();

                    if (driverFullName && !driverFullName.includes("Кр.")) {
                        const lastName = driverFullName.split(" ").pop();

                        if (lastName && lastName !== "№" && lastName !== "Пилот") {
                            results.push(lastName);
                        }
                    }
                }
            }

            if (results.length < 10) {
                alert("Не удалось распознать таблицу пилотов по этой ссылке.");
                return;
            }

            let fileName = "Загруженные_Результаты";
            const h1Tag = doc.querySelector("h1");
            
            if (h1Tag) {
                fileName = h1Tag.innerText.trim().replace(/[:\\/*?"<>|]/g, "");
            }

            const tableHTML = this.generateTableHTML(results);

            new FS().saveFile(tableHTML, `${fileName}.txt`, "text/plain");

        } catch (e) {
            console.error(e);
            alert("Ошибка при загрузке: " + e.message);
        }
        finally {
            loader.classList.add("hidden");
        }
    }

    generateTableHTML(driversOrder) {
        let html = `<table>\n    <tbody>\n        <tr>\n            <td>#</td>\n            <td>Кнопки</td>\n            <td>Гонщик</td>\n            <td>Шасси</td>\n            <td>Двигатель</td>\n            <td>Есть</td>\n        </tr>\n`;

        driversOrder.forEach((driverName, index) => {
            const driverInfo = this.f1Data.data1.find(d => d[0].includes(driverName)) || [driverName, "Неизвестно", "Неизвестно"];
            const chassis = driverInfo[1];
            const engine = driverInfo[2];

            html += `        <tr>\n`;
            html += `            <td><input class="position" value="${index + 1}"></td>\n`;
            html += `            <td>\n                <button class="buttonUp">▲</button>\n                <button class="buttonDown">▼</button>\n            </td>\n`;
            html += `            <td>${driverName}</td>\n`;
            html += `            <td>${chassis}</td>\n`;
            html += `            <td>${engine}</td>\n`;
            html += `            <td><input class="racerCheck" type="checkbox"></td>\n`;
            html += `        </tr>\n`;
        });

        html += `    </tbody>\n</table>`;
        return html;
    }
}