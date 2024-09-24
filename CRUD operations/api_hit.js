API_URL = 'http://localhost:8000/items'

function createImgIconCell(iconPath,myClassName,altName)
{
    let icon = document.createElement('img');
    icon.src = iconPath;
    icon.className = myClassName; 
    icon.alt = altName;

    return icon;
}

function createEmptyInputField()
{
    var inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'inputTextField';

    return inputField;
}
// function to get data from API endpoint
async function getData()
{
    try
    {
        const response = await fetch(API_URL,{method:'GET'});
        const myJSON = await response.json();
        console.log(myJSON);

        var myTable = document.getElementById("content-table");

        // Clear existing table rows
        while (myTable.rows.length > 1) 
        {
            myTable.deleteRow(1);
        }
        
        for(var uid in myJSON)
        {
            var entry = myJSON[uid]; 

            let newRow = document.createElement("tr");
            for(var key in entry)
            {
                if(key == "ID")
                    continue;

                let value = entry[key];
                
                var cell = document.createElement("td");
                cell.innerHTML = value;
                newRow.appendChild(cell);
            }

            let iconCell = document.createElement("td");

            // DELETE icon
            let trashIcon = createImgIconCell('trash-can-solid.svg','trashIcon',"Remove Icon");
            iconCell.appendChild(trashIcon);

            // Add event listener to 'remove trashIcon'
            trashIcon.addEventListener('click',createDeleteHandler(entry['ID']));
            
            // UPDATE icon
            let updateIcon = createImgIconCell('pen-to-square-solid.svg','updateIcon','Update Icon');
            iconCell.appendChild(updateIcon);
            
            // Add event listener to 'updateIcon'
            updateIcon.addEventListener('click',updateRecordHandler(entry['ID']));

            newRow.appendChild(iconCell);
            myTable.appendChild(newRow);
            
        }
    }
    catch(error)
    {
        console.error(error);
    }
}


let currRecordUpdateState = false;

function updateValuesInDB(record_id,cells)
{
    return async function()
    {
        var newTextBoxes = document.getElementsByClassName('inputTextField');
            
        var newName = newTextBoxes[0].value;
        var newAge = newTextBoxes[1].value;
        var newMovie = newTextBoxes[2].value;

        console.log(newName,newAge,newMovie);

        const newData = {
            Name: newName,
            Age: newAge,
            Movie: newMovie
        }
    
        var final_url = API_URL + '/' + record_id;
        try
        {
            const response = await fetch(final_url,{
                method:'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(newData)
            });
    
            if(response.ok)
            {
                console.log("Record Updated successfully");

                // Remove the input text fields and mention the new updated values in the normal text form
                // now substitute save icon with update icon
                for(var i = 0;i < cells.length - 1;i++)
                {
                    var td_cell = cells[i];
                    var child_cell = td_cell.childNodes[0];
                    var new_val = child_cell.value;

                    td_cell.removeChild(child_cell);
                    td_cell.innerHTML = new_val;
                }
                
                // getData(); // Re-fetch data after deletion
            }
            else
                console.log("Failed to Update record",response.statusText);
        }
        catch(error)
        {
            console.log(error)
        }
    }
}
// function to simulate update record
 function updateRecordHandler(record_id)
{
    return async function()
    {   
        if(currRecordUpdateState == false)
        {
            currRecordUpdateState = true;
            
            var row = this.closest('tr') // get the closest row
            var cells = row.querySelectorAll('td') // get all the cells in the row
            console.log(cells);

            for(var i = 0;i < cells.length - 1;i++) // exclude last icon cell
            {
                var cell = cells[i];
                var currentValue = cell.textContent; // get current text value

                // Replace the text content with input fields
                var inputTextFieldCell = createEmptyInputField();
                
                inputTextFieldCell.value = currentValue.trim();
                cell.textContent = '';
                cell.appendChild(inputTextFieldCell);
            }
            var lastIconCell = cells[cells.length - 1];
            var iconsCell = lastIconCell.querySelectorAll('img');

            // now substitute update icon with save icon
            let saveIcon = createImgIconCell('floppy-disk-solid.svg','saveIcon','Save Icon')

            // Store a reference to the original saveIcon
            let originalIconCell = iconsCell[1].parentNode;

            // Replace the second img element in iconsCell with saveIcon
            // Assuming iconsCell[1] is the element you want to replace
            iconsCell[1].parentNode.replaceChild(saveIcon, iconsCell[1]);

             // Add event listener to 'saveIcon'
             saveIcon.addEventListener('click', function() {
                
                // Call updateValuesInDB when saveIcon is clicked
                updateValuesInDB(record_id, cells)();

                // Restore the original icon cell by replacing saveIcon with the original icon cell
                originalIconCell.replaceChild(iconsCell[1], saveIcon);
            });

            currRecordUpdateState = false;
        }

    }
}

function InsertValuesInDB()
{
    return async function()
    {
        var newTextBoxes = document.getElementsByClassName('inputTextField');
            
        var newName = newTextBoxes[0].value;
        var newAge = newTextBoxes[1].value;
        var newMovie = newTextBoxes[2].value;

        console.log(newName,newAge,newMovie);

        const newData = {
            Name: newName,
            Age: newAge,
            Movie: newMovie
        }

        var final_url = API_URL + '/';
        try
        {
            const response = await fetch(final_url,{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(newData)
            });
    
            if(response.ok)
            {
                console.log("Record Inserted successfully");
            }
            else
                console.log("Failed to Insert record",response.statusText);
        }
        catch(error)
        {
            console.log(error)
        }
    }
}
async function createRecord()
{
    console.log("create new record");

    let myTable = document.getElementById("content-table");

    let any_tr_row = myTable.getElementsByTagName('tr')[0];
    let td_count = any_tr_row.childElementCount;

    let new_tr_row = document.createElement("tr"); // create a new <tr> element
    for(var i = 0;i < td_count - 1;i++)
    {
        let new_td_cell = document.createElement("td");  // create a <td> element
        var inputTextFieldCell = createEmptyInputField();

        new_td_cell.append(inputTextFieldCell);
        new_tr_row.appendChild(new_td_cell);

    }
    let td_icon_cell = document.createElement("td");  // create a <td> element

    // DELETE icon
    let trashIcon = createImgIconCell('trash-can-solid.svg','trashIcon',"Remove Icon");
    td_icon_cell.appendChild(trashIcon);
    
    // UPDATE icon
    // let updateIcon = createImgIconCell('pen-to-square-solid.svg','updateIcon','Update Icon');
    // td_icon_cell.appendChild(updateIcon);

    // SAVE icon
    let saveIcon = createImgIconCell('floppy-disk-solid.svg','saveIcon','Save Icon')
    td_icon_cell.appendChild(saveIcon);

    new_tr_row.appendChild(td_icon_cell);

    myTable.insertBefore(new_tr_row,myTable.firstChild);

    // Add event listener to 'saveIcon'
    saveIcon.addEventListener('click', function() {
                
        // Call updateValuesInDB when saveIcon is clicked
        InsertValuesInDB()();

        // Restore the original icon cell by replacing saveIcon with the original icon cell
        // originalIconCell.replaceChild(iconsCell[1], saveIcon);
    });

}

// function to delete a record invoking an API endpoint
function createDeleteHandler(record_id)
{
    return async function() 
    {
        var final_url = API_URL + '/' + record_id;
        try
        {
            const response = await fetch(final_url,{
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json'
                },
                // body:
            });

            if(response.ok)
            {
                console.log("Record deleted successfully");
                getData(); // Re-fetch data after deletion
            }
            else
                console.log("Failed to delete record",response.statusText);
        }
        catch(error)
        {
            console.log(error)
        }
    }
    
    getData()
}


getData();