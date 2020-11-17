// DOM queuries
let doc = document.querySelector(".faculties");
let search = document.querySelector(".search input");

// Global instances
let listOfFaculties;
let duplicateArray = [];
let courseArray = [];

// display faculty
function getFaculties() {
    console.log(courses2019W);
    listFields(courses2019W);
}

// print the faculties and take out all duplicates
function listFields(array) {
    array.sort(compare);
    duplicateArray = [];
    let html = '<ul class="faculty-list alt">';
    for (let i = 0; i < array.length; i++) {
        if (!duplicateArray.includes(array[i].code)) {
            duplicateArray.push(array[i].code);
            let facultyCode = array[i].code;
            let facultyName = array[i].title;
            let faculty = `${facultyCode}: ${facultyName}`;
            html += `<li onclick = "getCourses(${i})" id = ${i}>${faculty}</li>`;
        }
    }
    doc.innerHTML = html + '</ul>';
    // doc.innerHTML += '</ul>';
}

// function to order faculties by alphabetical order - called in listFields
function compare(a, b) {
    const codeA = a.code.toUpperCase();
    const codeB = b.code.toUpperCase();

    let comparison = 0;
    if (codeA > codeB) {
        comparison = 1;
    } else if (codeA < codeB) {
        comparison = -1;
    }
    return comparison
}

// Displays courses under faculty - called when faculty is clicked from listFields
function getCourses(id) {
    let html = '<ul class="faculty-list alt">';
    let courseList = courses2019W[id].courses[0];
    courseArray = Object.entries(courseList);
    console.log(courseArray);

    doc.innerHTML = "";
    for (let i = 0; i < courseArray.length; i++) {
        let courseName = courseArray[i][1].course_name;
        let courseTitle = courseArray[i][1].course_title;
        let courseDescription = courseArray[i][1].description; // unable to add this yet
        let course = `${courseName}: ${courseTitle}`;
        html += `<li onclick = "putLocal(this)" value="${courseDescription}">${course}</li>`;
    }
    doc.innerHTML = html + '</ul>';
}

// store courseName and courseTitle on local server - called in getCourses
function putLocal(cn) {
    window.scrollTop = 0;
    let innerText = cn.textContent;
    // let courseName = courseName;
    // let courseTitle = courseTitle;
    // let courseDescription = cn.description;
    let courseName = innerText.split(":")[0];
    let courseTitle = innerText.split(":")[1];
    let courseDescription = cn.getAttribute("value");
    localStorage.setItem("courseName", courseName);
    localStorage.setItem("courseTitle", courseTitle);
    localStorage.setItem("courseDescription", courseDescription);
    window.location.assign("/courses.html");
}

getFaculties();

// search keyup event to fiter as typing
search.addEventListener("keyup", e => {
    console.log(search.value.trim());
    const term = search.value.trim().toLowerCase();
    if (search.value.length = 5 && search.value.length <= 6) {
        // see if search values matches first four numbers of faculty code
        // filter to match and call getCourses of that faculty
        console.log(search.value);
        filterTodos(term);
        matchToFaculty(term);
        // filterTodos(term);
    } else {
        filterTodos(term);
    }
});

const matchToFaculty = (searchValue => {
    let facultyList = document.querySelector(".faculty-list");
    console.log(facultyList.children);
    console.log(searchValue);
    Array.from(facultyList.children).forEach(todo => {
        // console.log(searchValue);
        // console.log(todo.textContent.toLowerCase().substring(0,4));
        // console.log(searchValue === todo.textContent.toLowerCase().substring(0,4));
        if (todo.textContent.toLowerCase().substring(0,4) == searchValue) {
            console.log("found it");
            for (let i = 0; i < facultyList.children.length; i++) {
                if (!facultyList.children[i].className.includes("filtered")) {
                    console.log(facultyList.children[i].id);
                    getCourses(facultyList.children[i].id);
                }
            }

        }
        console.log("im in here");
    })
})

const filterTodos = (term => {
    let facultylist = document.querySelector(".faculty-list");
    console.log(facultylist);
    Array.from(facultylist.children).filter(todo => {
        // console.log(todo);
        return !todo.textContent.toLowerCase().substring(0,4).includes(term);
    }).forEach(todo => {
        todo.classList.add("filtered");
    });

    Array.from(facultylist.children).filter(todo => {
        return todo.textContent.toLowerCase().substring(0,4).includes(term);
    }).forEach(todo => {
        todo.classList.remove("filtered");
    })
})

// original fetch function before storing courses locally
// function getFaculties() {
//     fetch("https://ubc-courses-api.herokuapp.com/tree/2020S").then (response => {
//         return response.json();
//     }).then(data => {
//         return data;
//     }).then (data => {
//         console.log(data);
//         listOfFaculties = data;
//         listFields(listOfFaculties);
//         })
// };