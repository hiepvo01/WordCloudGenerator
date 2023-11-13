var dropZone = document.getElementById('drop-zone');
var uploadForm = document.getElementById('uploadForm');
var files = [];
var names = [];

var startUpload = function(file) {
    if (names.includes(file.name)){
        alert('This file is already added')
    } else {
        files.push(file)
        names.push(file.name)
    }
    if (document.getElementById('files_names')){
        let el = document.getElementById('files_names')
        el.remove();
    }
    container = document.getElementById('drop-files')
    files_names = document.createElement('div')
    files_names.classList.add('alert')
    files_names.classList.add('alert-info')
    files_names.setAttribute('id', 'files_names')
    let all = ''
    for(f of files) {
        all = all + f.name + ', '
    }
    files_names.innerText = all.substring(0, all.length - 2)
    console.log(files)

    container.appendChild(files_names)
}

function formSubmit(){
    if(files.length > 0) {
        for(file of files) {
            console.log(file)
            let xhr = new XMLHttpRequest();
            let formData = new FormData();
            formData.set('file', file)
            xhr.open("POST", 'https://worldcloud-77ba.onrender.com/', true);
            xhr.send(formData);
            // if (localStorage.getItem('files')){
            //     for (d in formData) {
            //         console.log(d)
            //         localStorage.getItem('files').push(d)
            //     }
            // } else {
            //     localStorage.setItem('files', formData)
            // }
        }
        alert("Data Files have been uploaded to server")
    } else {
        alert("No files added, going to graphs")
        location.href = "visual.html"
    }
}

async function clearData(){
    await fetch("https://worldcloud-77ba.onrender.com/clear").then(response => response.json())
    alert("Data is cleared")
}

dropZone.ondrop = function(e) {
    e.preventDefault();
    this.className = 'upload-drop-zone';

    startUpload(e.dataTransfer.files[0])
}

dropZone.ondragover = function() {
    this.className = 'upload-drop-zone drop';
    return false;
}

dropZone.ondragleave = function() {
    this.className = 'upload-drop-zone';
    return false;
}
