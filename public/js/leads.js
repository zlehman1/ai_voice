function updateFileName() {
  const fileInput = document.querySelector('.leadImportFile');
  const fileNameLabel = document.querySelector('.fileName');
  const fileName = fileInput.files[0].name;
  fileNameLabel.textContent = fileName;

  if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.type === 'text/csv') {
          const reader = new FileReader();
          reader.onload = function(event) {
              const csv = event.target.result;
              const objects = parseCSV(csv);
              console.log(objects); // Log the array of objects
          };
          reader.readAsText(file);
      } else {
          alert('Please select a CSV file.');
      }
  }
}

function parseCSV(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const objects = [];

  for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const obj = {};

      for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = values[j];
      }

      objects.push(obj);
  }

  return objects;
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'copy';
  event.target.classList.add('dragover');
}

function handleFileDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.classList.remove('dragover');

  const files = event.dataTransfer.files;
  if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv') {
          const fileNameLabel = document.querySelector('.fileName');
          fileNameLabel.textContent = file.name;
          const reader = new FileReader();
          reader.onload = function(event) {
              const csv = event.target.result;
              const objects = parseCSV(csv);
              console.log(objects); // Log the array of objects
          };
          reader.readAsText(file);
      } else {
          alert('Please drop a CSV file.');
      }
  }
}
