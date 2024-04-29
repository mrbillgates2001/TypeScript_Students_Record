"use strict";
let formCreate = document.getElementById("formCreate");
let formUpdate = document.getElementById("formUpdate");
let firstNameInput = document.getElementById("firstNameInput");
let lastNameInput = document.getElementById("lastNameInput");
let addressInput = document.getElementById("addressInput");
let birthDateInput = document.getElementById("birthDateInput");
let positionInput = document.getElementById("positionInput");
let levelInput = document.getElementById("levelInput");
let salaryInput = document.getElementById("salaryInput");
let familyStatusInput = document.getElementById("familyStatusInput");
let searchTerm = document.getElementById("search");
// ADD FORM VALIDATION ///////////////////////////////////////
const forms = Array.from(document.querySelectorAll(".needs-validation"));
// Loop over them and prevent submission
Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add("was-validated");
    }, false);
});
// 2. Local Storage Functions:
function getStudentsFromStorage() {
    const studentsString = localStorage.getItem("students");
    if (studentsString === null) {
        return [];
    }
    return JSON.parse(studentsString);
}
function setStudentsToStorage(students) {
    localStorage.setItem("students", JSON.stringify(students));
}
mapStudentsToTable(getStudentsFromStorage());
// 3. CRUD Operations:
// ADD ////
function createStudent(student) {
    let students = getStudentsFromStorage();
    students.push(student);
    setStudentsToStorage(students);
    formCreate.reset();
    mapStudentsToTable(students);
}
formCreate.addEventListener("submit", (e) => {
    e.preventDefault();
    let student = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        address: addressInput.value.trim(),
        birthDate: birthDateInput.value.trim(),
        position: positionInput.value.trim(),
        level: levelInput.value.trim(),
        salary: Number(salaryInput.value),
        familyStatus: familyStatusInput.value.trim(),
    };
    if (student.firstName.length &&
        student.lastName.length &&
        student.address.length &&
        student.birthDate.length &&
        student.position.length &&
        student.familyStatus.length) {
        createStudent(student);
        console.log("form submitted");
        student = {
            firstName: "",
            lastName: "",
            address: "",
            birthDate: "",
            position: "",
            level: "",
            salary: 0,
            familyStatus: "",
        };
    }
});
// UPDATE ////
// function updateStudent(index: number, student: Student) {
// 	const students = getStudentsFromStorage();
// 	students[index] = student;
// 	setStudentsToStorage(students);
// }
// formUpdate.addEventListener("submit", (e) => {
// 	e.preventDefault();
// 	console.log("form editted");
// });
// DELETE ////
function deleteStudent(index) {
    const students = getStudentsFromStorage();
    if (confirm("Are you sure you want to delete this student? ")) {
        students.splice(index, 1);
        setStudentsToStorage(students);
        mapStudentsToTable(students);
    }
}
// 4. Table Mapping Function:
function mapStudentsToTable(students) {
    const tbody = document.getElementById("student-table-body");
    tbody.innerHTML = ""; // Clear existing data
    students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
		<td>${index + 1}</td>
		<td>${student === null || student === void 0 ? void 0 : student.firstName}</td>
		<td>${student === null || student === void 0 ? void 0 : student.lastName}</td>
		<td>${student === null || student === void 0 ? void 0 : student.address}</td>
		<td>${student === null || student === void 0 ? void 0 : student.birthDate}</td>
		<td>${student === null || student === void 0 ? void 0 : student.position}</td>
		<td>${student === null || student === void 0 ? void 0 : student.level}</td>
		<td>${student === null || student === void 0 ? void 0 : student.salary}</td>
		<td>${student === null || student === void 0 ? void 0 : student.familyStatus}</td>
		<td class="">
			
			<button
				class="btn btn-danger btn-sm"
				onclick="deleteStudent(${index})">
				🗑️
			</button>
		</td>
	  `;
        tbody.appendChild(row);
    });
}
// 5. Search, Filter, and Sort Functions (Implementation Examples):
// SEARCH BAR FUNCTION
const search = document.getElementById("search");
search.addEventListener("input", (e) => {
    const target = e.target;
    const value = target.value.toLowerCase(); // Search term in lowercase
    const students = getStudentsFromStorage();
    const filteredStudents = students.filter((student) => {
        var _a;
        const fullName = (_a = ((student === null || student === void 0 ? void 0 : student.firstName) +
            " " +
            (student === null || student === void 0 ? void 0 : student.lastName) +
            " " +
            (student === null || student === void 0 ? void 0 : student.address) +
            " " +
            (student === null || student === void 0 ? void 0 : student.familyStatus) +
            " " +
            (student === null || student === void 0 ? void 0 : student.birthDate))) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        return fullName === null || fullName === void 0 ? void 0 : fullName.includes(value); // Check for case-insensitive inclusion
    });
    mapStudentsToTable(filteredStudents); // Map only filtered students
});
// FILTER FUNCTION
// Filter by Position
// const selectPosition = document.getElementById(
// 	"selectPosition"
//   ) as HTMLSelectElement;
//   selectPosition.addEventListener("input", (e: Event) => {
// 	const target = e.target as HTMLSelectElement;
// 	const position = target.value;
// 	const students = getStudentsFromStorage();
// 	let filteredStudents: Student[] = [];
// 	if (position === "Job position") {  // Check for empty value (All Positions)
// 	  filteredStudents = students;
// 	} else {
// 	  filteredStudents = students.filter(
// 		(student) => student?.position === position
// 	  );
// 	}
// 	if (filteredStudents.length === 0) {
// 	  // Handle empty results (e.g., display a message)
// 	  console.log("No students found matching the selected position.");
// 	  // You can also modify the table to display a message here
// 	} else {
// 	  mapStudentsToTable(filteredStudents);  // Only map if students found
// 	}
//   });
// function filterStudentsByLevel(level: string) {
// 	const students = getStudentsFromStorage();
// 	const filteredStudents = students.filter(
// 		(student) => student.level === level
// 	);
// 	mapStudentsToTable(filteredStudents);
// }
// SORT FUNCTION
const descOption = document.getElementById("desc");
const ascOption = document.getElementById("asc");
descOption.addEventListener("click", () => sortStudentsBySalary("desc"));
ascOption.addEventListener("click", () => sortStudentsBySalary("asc"));
function sortStudentsBySalary(sortType) {
    const students = getStudentsFromStorage();
    students.sort((a, b) => {
        if (sortType === "asc") {
            return a.salary - b.salary;
        }
        else {
            return b.salary - a.salary;
        }
    });
    mapStudentsToTable(students);
}
