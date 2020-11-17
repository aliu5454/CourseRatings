// DOM queries
let search = document.querySelector(".search");
let search_input = document.getElementById("search-input");
let error_message = document.querySelector(".tooltiptext");

search.addEventListener("submit", e => {
    e.preventDefault();
    let userInput = search_input.value.toUpperCase();
    let faculty = userInput.substring(0,4).trim();
    let courseCode = userInput.substring(4).trim();
    console.log(faculty, courseCode);
    console.log(courses2019W);
    let facultyFound = false;
    let courseFound = false;

    for (let i = 0; i < courses2019W.length; i++) {
        if (courses2019W[i].code === faculty) {
            let availableCourses = Object.entries(courses2019W[i].courses[0]);
            facultyFound = true;

            availableCourses.forEach(course => {
                if (course[0].includes(courseCode)) {
                    courseFound = true;
                    let courseName = course[1].course_name;
                    let courseTitle = course[1].course_title;
                    let courseDescription = course[1].description;
                    localStorage.setItem("courseName", courseName);
                    localStorage.setItem("courseTitle", courseTitle);
                    localStorage.setItem("courseDescription", courseDescription);
                    window.location.assign("/courses.html");
                }
            })
        }
    }
    if (!facultyFound) {
        error_message.innerHTML = "The faculty code you entered is invalid";
    } else if (!courseFound) {
        error_message.innerHTML = "The course code you entered is invalid";
    }
    
});