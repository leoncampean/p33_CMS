
const TABLE_DATA = 'employees';
const TABLE_ROW_NEXT_ID = 'employeeNextId';
moment.locale('en')
window.onload = () => {

    initializeTableData();

    document.getElementById("add-employee-button").addEventListener("click", addNewEmployee, false);
    document.querySelectorAll(".close-employee-modal").forEach(e =>{
        e.addEventListener("click", closeModal, false);
    });

}

function initializeTableData() {

    employees = JSON.parse(localStorage.getItem(TABLE_DATA));
    if (employees == undefined) {
        employeeNextId = 0
        employees = [
            new Employee(employeeNextId++,'Campean', 'Leon', 'leon.campean@principal.com', 'Barbat', '2000-03-17', ''),
            new Employee(employeeNextId++,'Mcgregor', 'Connor', 'connor@iCantFightAnymore.com', 'Femeie', '1980-12-10', ''),
            new Employee(employeeNextId++,'Cristiano', 'Penaldo', 'overratedASF@babygirl.com', 'Femeie', '2002-09-20', ''),
            new Employee(employeeNextId++,'Norris', 'Chuck', 'king@yourboss.com', 'King', '1989-12-10', ''),
        ]

        localStorage.setItem(TABLE_DATA, JSON.stringify(employees));
        localStorage.setItem(TABLE_ROW_NEXT_ID, JSON.stringify(employeeNextId));
    }

    maintainEmployeeOrder();
}

function populateTable(employees) {
    tableBody = document.getElementById("employees-table-body")
    tableBody.innerHTML = '';

    employees.forEach(e => {
        tableBody.innerHTML += `<tr employee-id=${e.employeeId}>
            <td>${e.lastname}</td>
            <td>${e.firstname}</td>
            <td>${e.email}</td>
            <td>${e.sex}</td>
            <td>${e.birthdate}</td>
            <td><span class="delete-row fa fa-remove"></span></td>
        </tr>`
    });
}

function addNewEmployee(){
    modal = document.getElementById("add-employee-modal");

    employeeLastName = document.getElementById("nume-form").value;
    employeeFristname = document.getElementById("prenume-form").value;
    employeeEmail = document.getElementById("email-form").value;
    employeeSex = document.getElementById("sex-form").value;
    employeeBirthdate = document.getElementById("data-form").value;

    var reader = new FileReader();

    // Populate table once the image is ready

    completeAddTableRowAction(employeeLastName, employeeFristname, employeeEmail, employeeSex, employeeBirthdate);
    
}

// creates new employee object
function Employee(employeeId, lastname, firstname, email, sex, birthdate, profilePic) {
    this.employeeId = employeeId;
    this.lastname = lastname;
    this.firstname = firstname;
    this.email = email;
    this.birthdate = moment(birthdate).format('Do MMMM YYYY');
    this.sex = sex;
    this.profilePic= profilePic;
}

// function needed to be called from image loaded callback and addNewEmployee function body
function completeAddTableRowAction(employeeLastName, employeeFristname, employeeEmail, employeeSex, employeeBirthdate, employeeProfilePic = '') {
    //formIsValid = validateEmployeeFields(employeeLastName, employeeFristname, employeeEmail, employeeSex, employeeBirthdate);

        employeeId = JSON.parse(localStorage.getItem(TABLE_ROW_NEXT_ID));
        allEmployees = JSON.parse(localStorage.getItem(TABLE_DATA));

        newEmployee = new Employee(employeeId++, employeeLastName, employeeFristname, employeeEmail, employeeSex, employeeBirthdate, employeeProfilePic);
        allEmployees.push(newEmployee);
        // to do call method to sort items

        localStorage.setItem(TABLE_ROW_NEXT_ID, JSON.stringify(employeeId));
        localStorage.setItem(TABLE_DATA, JSON.stringify(allEmployees));

        maintainEmployeeOrder()
        resetModalForm();
}

function previewProfilePicture(){
    employeeProfilePicPreview = document.getElementById("profile-picture").files[0];
    previewWrapper = document.querySelector('.preview-image-wrapper');
    var reader = new FileReader();

    // Populate table once the image is ready
    reader.addEventListener ("load", () => {
        chosenImage = reader.result;
        previewWrapper.style = 'display:block';
        document.getElementById("profile-picture-preview").setAttribute('src', chosenImage);
    });

    reader.readAsDataURL(employeeProfilePicPreview)
}

function resetModalForm(){
    document.getElementById("nume-form").value = '';
    document.getElementById("prenume-form").value = '';
    document.getElementById("email-form").value = '';
    document.getElementById("sex-form").value = '';
    document.getElementById("data-form").value = '';

}

function compareNamesAsc(a, b) {
    if ((a.lastname + a.firstname) < (b.lastname + b.firstname)){
        return -1;
      }
      if ((a.lastname + a.firstname) > (b.lastname + b.firstname)){
        return 1;
      }
      return 0;
}

// the smaller the year, the older the person
function compareBirthdateAsc(a, b) {
    ageA = parseInt(moment(a.birthdate).fromNow().split(' ')[0]); // "13 years ago" --> 13 as an int 
    ageB = parseInt(moment(b.birthdate).fromNow().split(' ')[0]);
    
    if (ageA < ageB){
        return -1;
      }
      if (ageA > ageB){
        return 1;
      }
      return 0;
}

function compareNamesDesc(a, b) {
    if ((a.lastname + a.firstname) < (b.lastname + b.firstname)) {
        return 1;
      }
      if ((a.lastname + a.firstname) > (b.lastname + b.firstname)){
        return -1;
      }
      return 0;
}

function compareBirthdateDesc(a, b) {
    ageA = parseInt(moment(a.birthdate).fromNow().split(' ')[0]); // "13 years ago" --> 13 as an int 
    ageB = parseInt(moment(b.birthdate).fromNow().split(' ')[0]);
    
    if (ageA < ageB){
        return 1;
      }
      if (ageA > ageB){
        return -1;
      }
      return 0;
}

function setDelete() {
    document.querySelectorAll(".delete-row").forEach(e => {
        e.addEventListener("click", deleteEmployeeRow, false);
    });
}

function deleteEmployeeRow(htmlDeleteElement) {
    if(confirm("Sunteti sigur ca doriti sa stergeti angajatul ? \n Aceasta actiune este ireversibila.")){
        rowToBeDeleted = htmlDeleteElement.target.closest("tr");

        employeeToDeleteId = rowToBeDeleted.getAttribute("employee-id");
        rowToBeDeleted.remove();

        allEmployees = JSON.parse(localStorage.getItem(TABLE_DATA));
        allEmployees = allEmployees.filter(e => e.employeeId != employeeToDeleteId);

        localStorage.setItem(TABLE_DATA, JSON.stringify(allEmployees));
    }
}

//Sorts and re-prints whole table
function maintainEmployeeOrder() {
    allEmployees = JSON.parse(localStorage.getItem(TABLE_DATA));

    //fieldToSortBy = document.getElementById("table-sort-by").value;
    //sortOrder = document.getElementById("table-sort-order").value;

   /* if(fieldToSortBy == 'name'){
        if(sortOrder == 'ascendent'){
            allEmployees.sort(compareNamesAsc);
        }else{
            allEmployees.sort(compareNamesDesc);
        }
    }else if(fieldToSortBy == 'birthdate'){
        if(sortOrder == 'ascendent'){
            allEmployees.sort(compareBirthdateAsc);
        }else{
            allEmployees.sort(compareBirthdateDesc);
        }
    } */
    
    populateTable(allEmployees);
    setDelete();
}

//modal controls https://dev.to/ara225/how-to-use-bootstrap-modals-without-jquery-3475

function openModal() {
    document.getElementById('add-employee-modal').style = "display:block";
    document.getElementById('add-employee-modal').classList.add("show");
}
function closeModal() {
    document.getElementById('add-employee-modal').style = "display:none";
    document.getElementById('add-employee-modal').classList.remove("show");
    resetModalForm();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == document.getElementById('add-employee-modal')) {
    closeModal();
  }
}


//Validators
function validateEmployeeFields(employeeLastName, employeeFristname, employeeEmail, employeeSex, employeeBirthdate) {
    if(employeeLastName == "") {
        alert("Numele este un camp obligatoriu !")
        return false;
    }
    if(employeeFristname == "") {
        alert("Prenumele este un camp obligatoriu !")
        return false;
    }
    if(employeeEmail == "") {
        // alert("Email-ul nu este valid !")
        alert("Email-ul este un camp obligatoriu !")
        return false;
    }else{
        //regex validation for email:  https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(! re.test(employeeEmail)) {
            alert("Email-ul introdus nu este valid !")
            return false;
        }
    }
    if(employeeSex == "") {
        alert("Trebuie sa selectati sex-ul angajatului !")
        return false;
    }
    if(employeeBirthdate == "") {
        alert("Data nasterii este un camp obligatoriu !")
        return false;
    }else if(! validateAgeAtLeast16(employeeBirthdate)){
        alert("Angajatul trebuie sa aiba cel putin 16 ani !");
        return false;
    }

    return true;
}

// https://www.codegrepper.com/code-examples/javascript/javascript+funtion+to+calculate+age+above+18
function validateAgeAtLeast16(dateStr) {
    birthdate = new Date(dateStr);
    dateDifference = new Date(Date.now() - birthdate.getTime());
    personAge = dateDifference.getUTCFullYear() - 1970;
    
    return personAge >= 16;
}