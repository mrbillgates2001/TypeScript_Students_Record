let formCreate = document.getElementById("formCreate") as HTMLFormElement;
let formUpdate = document.getElementById("formUpdate") as HTMLFormElement;
let firstNameInput = document.getElementById(
	"firstNameInput"
) as HTMLInputElement;
let lastNameInput = document.getElementById(
	"lastNameInput"
) as HTMLInputElement;
let addressInput = document.getElementById("addressInput") as HTMLInputElement;
let birthDateInput = document.getElementById(
	"birthDateInput"
) as HTMLInputElement;
let positionInput = document.getElementById(
	"positionInput"
) as HTMLSelectElement;
let levelInput = document.getElementById("levelInput") as HTMLSelectElement;
let salaryInput = document.getElementById("salaryInput") as HTMLInputElement;
let familyStatusInput = document.getElementById(
	"familyStatusInput"
) as HTMLInputElement;

let searchTerm = document.getElementById("search");

// ADD FORM VALIDATION ///////////////////////////////////////

const forms: HTMLFormElement[] = Array.from(
	document.querySelectorAll(".needs-validation")
);

// Loop over them and prevent submission
Array.from(forms).forEach((form: HTMLFormElement) => {
	form.addEventListener(
		"submit",
		(event) => {
			if (!(form as HTMLFormElement).checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}

			form.classList.add("was-validated");
		},
		false
	);
});

// 1. Interface for Student Data:

interface Student {
	firstName: string;
	lastName: string;
	address: string;
	birthDate: string;
	position: string;
	level: string;
	salary: number;
	familyStatus: string;
}

// 2. Local Storage Functions:

function getStudentsFromStorage(): Student[] {
	const studentsString = localStorage.getItem("students");
	if (studentsString === null) {
		return [];
	}
	return JSON.parse(studentsString) as Student[];
}

function setStudentsToStorage(students: Student[]) {
	localStorage.setItem("students", JSON.stringify(students));
}

mapStudentsToTable(getStudentsFromStorage());

// 3. CRUD Operations:
// ADD ////

function createStudent(student: Student) {
	let students: Student[] = getStudentsFromStorage();
	students.push(student);
	setStudentsToStorage(students);
	formCreate.reset();
	mapStudentsToTable(students);
}

formCreate.addEventListener("submit", (e) => {
	e.preventDefault();
	let student: Student = {
		firstName: firstNameInput.value.trim(),
		lastName: lastNameInput.value.trim(),
		address: addressInput.value.trim(),
		birthDate: birthDateInput.value.trim(),
		position: positionInput.value.trim(),
		level: levelInput.value.trim(),
		salary: Number(salaryInput.value),
		familyStatus: familyStatusInput.value.trim(),
	};
	if (
		student.firstName.length &&
		student.lastName.length &&
		student.address.length &&
		student.birthDate.length &&
		student.position.length &&
		student.familyStatus.length
	) {
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

function updateStudent(index: number, student: Student) {
	const students = getStudentsFromStorage();
	students[index] = student;

	setStudentsToStorage(students);
}

formUpdate.addEventListener("submit", (e) => {
	e.preventDefault();

	console.log("form editted");
});

// DELETE ////

function deleteStudent(index: number) {
	const students = getStudentsFromStorage();
	if (confirm("Are you sure you want to delete this student? ")) {
		students.splice(index, 1);
		setStudentsToStorage(students);
		mapStudentsToTable(students);
	}
}

// 4. Table Mapping Function:

function mapStudentsToTable(students: Student[]) {
	const tbody = document.getElementById(
		"student-table-body"
	) as HTMLTableElement;
	console.log(students);
	tbody.innerHTML = ""; // Clear existing data

	students.forEach((student, index) => {
		const row = document.createElement("tr");
		row.innerHTML = `
		<td>${index + 1}</td>
		<td>${student?.firstName}</td>
		<td>${student?.lastName}</td>
		<td>${student?.address}</td>
		<td>${student?.birthDate}</td>
		<td>${student?.position}</td>
		<td>${student?.level}</td>
		<td>${student?.salary}</td>
		<td>${student?.familyStatus}</td>
		<td class="">
			<button
				data-bs-toggle="modal"
				data-bs-target="#updateModal"
				class="btn btn-warning btn-sm"
				onclick="updateStudent(${index})">
				📝
			</button>
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

function searchStudents() {
	let searchTerm = (document.getElementById("search") as HTMLInputElement)
		.value;
	const students = getStudentsFromStorage();
	const filteredStudents = students.filter((student) => {
		const fullName = student.firstName + " " + student.lastName;
		return fullName.toLowerCase().includes(searchTerm.toLowerCase());
	});
	mapStudentsToTable(filteredStudents);
}
const search = document.getElementById("search") as HTMLInputElement;
search.addEventListener("change", () => searchStudents());

function filterStudentsByPosition(position: string) {
	const students = getStudentsFromStorage();
	const filteredStudents = students.filter(
		(student) => student.position === position
	);
	mapStudentsToTable(filteredStudents);
}

function filterStudentsByLevel(level: string) {
	const students = getStudentsFromStorage();
	const filteredStudents = students.filter(
		(student) => student.level === level
	);
	mapStudentsToTable(filteredStudents);
}

const descOption = document.getElementById("desc") as HTMLButtonElement;
const ascOption = document.getElementById("asc") as HTMLButtonElement;

descOption.addEventListener("click", () => sortStudentsBySalary("desc"));
ascOption.addEventListener("click", () => sortStudentsBySalary("asc"));

function sortStudentsBySalary(sortType: "asc" | "desc") {
	const students = getStudentsFromStorage();
	students.sort((a, b) => {
		if (sortType === "asc") {
			return a.salary - b.salary;
		} else {
			return b.salary - a.salary;
		}
	});
	mapStudentsToTable(students);
}
