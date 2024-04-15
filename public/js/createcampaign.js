let isLeadUploaded = false;
var formattedLeadsObject = {"Name": [], "Country Code": [], "Phone": []}
var desiredColumnLength = 3

function updateFileName() {
    const fileInput = document.querySelector(".leadImportFile");
    const fileNameLabel = document.querySelector(".fileName");
    const fileName = fileInput.files[0].name;
    fileNameLabel.textContent = fileName;
  
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.type === "text/csv") {
        const reader = new FileReader();
        reader.onload = function (event) {
          const csv = event.target.result;
          CSVToArray(csv);
          const objects = parseCSV(csv);
          // console.log(objects); // Log the array of objects
          processCSV(objects); // Log the array of objects
        };
        reader.readAsText(file);
      } else {
        alert("Please select a CSV file.");
      }
    }
  }
  
  function parseCSV(csv) {
  //   console.log(csv);
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const objects = [];
  
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
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
    event.dataTransfer.dropEffect = "copy";
    event.target.classList.add("dragover");
  }
  
  function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove("dragover");
  
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "text/csv") {
        const fileNameLabel = document.querySelector(".fileName");
        fileNameLabel.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function (event) {
          const csv = event.target.result;
          CSVToArray(csv);
          const objects = parseCSV(csv);
          // console.log(objects); // Log the array of objects
          processCSV(objects); // Log the array of objects
        };
        reader.readAsText(file);
      } else {
        alert("Please drop a CSV file.");
      }
    }
  }
  
  function processCSV(CSVObject) {
  //   console.log(CSVObject);
  }
  
  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ",";
  
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      // Delimiters.
      "(\\" +
        strDelimiter +
        "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        strDelimiter +
        "\\r\\n]*))",
      "gi"
    );
  
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
  
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
  
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while ((arrMatches = objPattern.exec(strData))) {
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];
  
      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }
  
      var strMatchedValue;
  
      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }
  
      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }
  
  //   console.log(arrData)
  
    // CSV Analysis
    if(arrData.length > 500) {
      // throw maximum limit error
      showNotificationFunction("danger","times-circle","true","CSV Exceeds Limit","The uploaded CSV cannot exceed 500 rows. Please reduce the number of rows and try again.")
      return false
    }
  
    if(arrData.length <= 20) {
      // throw minimum limit error
      showNotificationFunction("danger","times-circle","true","Insufficient CSV Size","The uploaded CSV must contain more than 20 rows. Please upload a CSV file with an adequate number of rows.")
      return false
    }
  
    console.log(arrData)
    
    if(arrData[0][0] == "Name" && arrData[0][1] == "Country Code" && arrData[0][2] == "Phone") {
    } else {
      // throw invalid headers error, kindly refer to the sample csv
      showNotificationFunction("danger","times-circle","true","Invalid CSV Headers","The uploaded CSV does not contain valid headers. Please refer to the sample CSV for correct header formatting.")
      return false
    }
  
    try {
      for(let i = 1; i < arrData.length; i++) {
        if(arrData[i].length == desiredColumnLength) {
            formattedLeadsObject["Name"].push(arrData[i][0])
            formattedLeadsObject["Country Code"].push(arrData[i][1])
            formattedLeadsObject["Phone"].push(arrData[i][2])
        }
      }
      
      isLeadUploaded = true
      console.log(formattedLeadsObject)

      if (formattedLeadsObject["Name"].length === formattedLeadsObject["Country Code"].length &&
            formattedLeadsObject["Country Code"].length === formattedLeadsObject["Phone"].length) {
                showNotificationFunction("success","check-circle","true","Success","All parameters in the CSV have been successfully validated.")
        } else {
            showNotificationFunction("danger","times-circle","true","Inconsistent Row Counts","Not all columns in the CSV have the same number of rows. Please ensure consistency across all columns.")
            return false
        }


    } catch (error) {
      showNotificationFunction("danger","times-circle","true","Error","An error has occurred in validating the CSV. Please try again.")
    }
  
    // Return the parsed data.
    return true;
  }
  

  document.querySelector(".createcampaignform").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(this);

    // Convert form data to JSON object
    const campaignData = {};
    formData.forEach((value, key) => {
      campaignData[key] = value;
    });

    if(isLeadUploaded == true) {
        campaignData["leads_data"] = formattedLeadsObject
    }

    axios
      .post("/panel/createcampaign", campaignData)
      .then((response) => {
        console.log(response)
        if(response.data == false) {
            showNotificationFunction("danger","times-circle","true","Error","An error has occurred. Please try again.")
        } else {
            showNotificationFunction("success","check-circle","true","Success","Campaign successfully created! 🎉")
            setTimeout(() => {
                window.location.href = "/panel/campaigns"
            }, 3000)
        }
      })

    console.log(campaignData)
})
