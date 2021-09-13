const TABLE_DATA = 'employees';
const TABLE_ROW_NEXT_ID = 'employeeNextId';
moment.locale('en')
// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0TH0kmRQAjdhDW3UuRw-b2kWgnfI67Ig",
  authDomain: "leon-cms.firebaseapp.com",
  projectId: "leon-cms",
  storageBucket: "leon-cms.appspot.com",
  messagingSenderId: "541291432314",
  appId: "1:541291432314:web:47239cdab5d9eeb0f82ec3",
  measurementId: "G-73S06D1ZXJ"
};

var app;
var db; 

window.onload = async () => {

    //initializeTableData();

    document.getElementById("add-employee-button").addEventListener("click", addNewEmployee, false);
    document.getElementById("inchidere").addEventListener("click", resetModalForm, false);
    document.getElementById("inchidere-sus").addEventListener("click", resetModalForm, false);
    document.getElementById("sortare_m").addEventListener("click", maintainEmployeeOrder, false);
    document.querySelectorAll(".close-employee-modal").forEach(e =>{
        e.addEventListener("click", closeModal, false);
    });
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    var lista = await getEmployees(db);
    populateTable(lista);
    setDelete();
}

// function initializeTableData() {

//     var employees = JSON.parse(localStorage.getItem(TABLE_DATA));
//     if (employees == undefined) {
//         var employeeNextId = 0
//         employees = [
//             new Employee(employeeNextId++,'Campean', 'Leon', 'leon.campean@principal.com', 'Barbat', '2000-03-17', ''),
//             new Employee(employeeNextId++,'Mcgregor', 'Connor', 'connor@iCantFightAnymore.com', 'Femeie', '1980-12-10', ''),
//             new Employee(employeeNextId++,'Cristiano', 'Penaldo', 'overratedASF@babygirl.com', 'Femeie', '2002-09-20', ''),
//             new Employee(employeeNextId++,'Norris', 'Chuck', 'king@yourboss.com', 'King', '1989-12-10', ''),
//             new Employee(employeeNextId++,'Albert0', 'Grasu', 'rap@manele.com', 'Indecis', '1999-10-10', ''),
//             new Employee(employeeNextId++,'Besleaga', 'Marin', 'marin@beseleaga.com', 'Barbat', '1989-12-10', ''),

//         ]
//         localStorage.setItem(TABLE_DATA, JSON.stringify(employees));
//         localStorage.setItem(TABLE_ROW_NEXT_ID, JSON.stringify(employeeNextId));
//     }

//     populateTable(employees);
//     setDelete();
// }

function populateTable(employees) {
    var tableBody = document.getElementById("employees-table-body")
    tableBody.innerHTML = '';

    employees.forEach(e => {
        tableBody.innerHTML += `<tr employee-id=${e.employeeId}>
            <td>${e.name}</td>
            <td>${e.surname}</td>
            <td>${e.email}</td>
            <td>${e.sex}</td>
            <td>${e.birthdate}</td>
            <td><span class="delete-row fa fa-remove"></span></td>
        </tr>`
    });
}

async function addNewEmployee(){
    var modal = document.getElementById("add-employee-modal");

    var employeeLastName = document.getElementById("nume-form").value;
    var employeeFristname = document.getElementById("prenume-form").value;
    var employeeEmail = document.getElementById("email-form").value;
    var employeeSex = document.getElementById("sex-form").value;
    var employeeBirthdate = document.getElementById("data-form").value;

    // Populate table once the image is ready

    if (validateEmployeeFields(employeeLastName, employeeFristname, employeeEmail, employeeSex, employeeBirthdate, )) {
        
        var newEmployee = {
            nume : employeeLastName,
            prenume : employeeFristname,
            email : employeeEmail,
            sex : employeeSex,
            birthdate : employeeBirthdate,

        }
        const employeesRef = collection(db, "employees")
        await addDoc(employeesRef ,newEmployee);

       // maintainEmployeeOrder()
        resetModalForm();
        var lista = await getEmployees(db);
        populateTable(lista);
    }
}


// Initialize Firebase
function setupFirebase() {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
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


function previewProfilePicture(){
    var employeeProfilePicPreview = document.getElementById("profile-picture").files[0];
    var previewWrapper = document.querySelector('.preview-image-wrapper');
    var reader = new FileReader();

    // Populate table once the image is ready
    reader.addEventListener ("load", () => {
        chosenImage = reader.result;
        previewWrapper.style = 'display:block';
        document.getElementById("profile-picture-preview").setAttribute('src', chosenImage);
    });

    reader.readAsDataURL(employeeProfilePicPreview)
}
async function getEmployees(db) {
    var employeeList = [];
    const employeeCol = collection(db, 'employees');
    const employeeSnapshot = await getDocs(employeeCol);
    employeeSnapshot.docs.forEach(doc => {
        var employee = doc.data();
        employee.employeeId = doc.id;
        employeeList.push(employee);
    });
    return employeeList;
}

function resetModalForm(){
    document.getElementById("nume-form").value = '';
    document.getElementById("prenume-form").value = '';
    document.getElementById("email-form").value = '';
    document.getElementById("sex-form").value = '';
    document.getElementById("data-form").value = '';

}

function compareNamesAsc(a, b) {
    if ((a.name + a.surname) < (b.name + b.surname)){
        return -1;
      }
      if ((a.name + a.surname) > (b.name + b.surname)){
        return 1;
      }
      return 0;
}

function compareBirthdateAsc(a, b) {
    ageA = parseInt(moment(a.birthdate).fromNow().split(' ')[0]);
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
    if ((a.name + a.surname) < (b.name + b.surname)) {
        return 1;
      }
      if ((a.name + a.surname) > (b.name + b.surname)){
        return -1;
      }
      return 0;
}

function compareBirthdateDesc(a, b) {
    ageA = parseInt(moment(a.birthdate).fromNow().split(' ')[0]);
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
        var rowToBeDeleted = htmlDeleteElement.target.closest("tr");

        var employeeToDeleteId = rowToBeDeleted.getAttribute("employee-id");
        rowToBeDeleted.remove();

        deleteEmployeeDocument(employeeToDeleteId);
    }
}

async function deleteEmployeeDocument(documentId) {
    try {
        await deleteDoc(doc(db, TABLE_DATA, documentId));
        console.log('Successfully deleted member with id $(documentId)');
    }
    catch (exception) {
        console.log(exception);
    }
}

//Sorts and re-prints whole table
async function maintainEmployeeOrder() {
    var allEmployees = await getEmployees(db);

    allEmployees.sort(compareNamesAsc);
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
    var birthdate = new Date(dateStr);
    var dateDifference = new Date(Date.now() - birthdate.getTime());
    var personAge = dateDifference.getUTCFullYear() - 1970;
    
    return personAge >= 16;
}