function returnHome() {
    location.href="index.html"
}

const filter = new Vue({
    el: "#filter",
    data: {
        files: [],
        topics: [1, 2, 3, 4, 5]
    }
});

function ckChange(ckType){
    var button_id = document.getElementById(ckType.id);
    if (button_id.innerText.includes('txt')){
        files = document.getElementById("file_names")
        files.innerText = button_id.innerText
    } else {
        topic = document.getElementById("topics")
        topic.innerText = button_id.innerText + " topics"
    }
}

function draw(data){

    container = document.getElementById('cloud')
    container.innerHTML = ""
    // create a tag cloud chart
    var chart = anychart.tagCloud(data);

    // set the chart title
    chart.title('Words Distribution')
    // set array of angles, by which words will be placed
    chart.angles([0, -45, 90])
    // enable color range
    chart.colorRange(true);
    // set color range length
    chart.colorRange().length('80%');

    // format tooltips
    var formatter = "{%value}{scale:(1)(1000)(1000)(1000)|()( thousand)( million)( billion)}";
    var tooltip = chart.tooltip();
    tooltip.format(formatter);

    // display chart
    chart.container("cloud");
    chart.draw();
}

function generateGraph(){
    file = document.getElementById("file_names")
    topic = document.getElementById("topics")

    if(file.innerText != "Choose File " && topic.innerText != "Topics ") {
        let allData = [];
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;
        
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                for(d in data) {
                    let total = 0;
                    for (m in data[d]){
                        total += data[d][m]
                    }
                    allData.push({
                        "x": d,
                        "value": total,
                        // "category": file.innerText
                    })
                }

                draw(allData)
                return allData
            }
        };
        if (file.innerText != "All.txt") {
            xhr.open("POST", 'https://worldcloud-77ba.onrender.com/words', false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                files: file.innerText,
                topics: topic.innerText[0]
            }));

        } else {
            let all = "";
            for(f of filter.files) {
                if(f != "All.txt") {
                    all = all + f + ', '
                }
            }
            all = all.substr(0, all.length-2)
            if (all != "") {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    files: all,
                    topics: topic.innerText[0]
                }));
            } else {
                alert("No data found. Please add more data")
            }
        }
    } else {
        alert("Please select both file and number of topics")
    }
}

window.onload = async function () {
    ref = await fetch('https://worldcloud-77ba.onrender.com/').then(response => response.json())
    filter.files = ref.message
    filter.files.push("All.txt")
}