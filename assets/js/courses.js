// DOM Query
const course = document.querySelector(".courses");
const reviewBlock = document.querySelector(".review-block");
const reviewList = document.querySelector(".review-list");
const thanks = document.querySelector(".thanks");
const metaDescription = document.getElementsByTagName("meta")["description"];
const metaKeywords = document.getElementsByTagName("meta")["keywords"];
let seatTracker = document.querySelectorAll(".tracker");
// const url = window.location.href;
// console.log(url);

// retrieve courseName and courseTitle from local storage
let courseName = localStorage.getItem("courseName");
let courseTitle = localStorage.getItem("courseTitle");

// put course information in meta tags
metaDescription.content += `${courseName}: ${courseTitle}`;
metaKeywords.content += ` ${courseName} ${courseTitle} course reviews`;
// console.log(metaDescription.content);
// console.log(metaKeywords.content);

// FETCH DATA FOR REMAINING SEATS AND DISPLAY in collapsible button
let facultyCode = courseName.substring(0,4);
let courseNumber = courseName.substring(5);
let seat = document.getElementById("getSeats");

async function getSeatData(facultyCode, courseNumber) {
    let fetchURL = `https://api.ubccourses.com/sectionInfo/${facultyCode}/${courseNumber}?realtime=1`;
    let response = await fetch(fetchURL);
    let data = await response.json();
    return data;
};

getSeatData(facultyCode, courseNumber).then(data => {
    // console.log(data);
    let html = "<h4>Sections Available:</h4>";

    data.forEach(section => {
        let name = section.name;
        // let subject = section.subject; // Ex. ECON
        // let course = section.course; // Ex. 101
        // let sectionNumber = section.section; // Ex. 001
        let status = section.status;
        let currentlyRegistered = section.currently_registered;
        let generalSeatsRemaining = section.general_seats_remaining;
        let restrictedSeatsRemaining = section.restricted_seats_remaining;
        let professor = section.prof;

        let seatStatusCode = false;
        let seatColor;
        let seatTrackButton = "";

        // check general and restricted seats remaining to display red or green circle next to section 
        if (generalSeatsRemaining == 0 && restrictedSeatsRemaining == 0) {
            // no seats remaining --> set color to red
            seatStatusCode = true;
            // add tracker optin with email input and submit button
            seatTrackButton = `<button onclick="emailPrompt(this.parentElement.parentElement)" class="button my-3 tracker">Track This Section</button>`;
        }

        // if seatStatusCode is false, make circle green, otherwise, make circle red
        if (seatStatusCode) {
            seatColor = `&#128308`;
        } else {
            seatColor = `&#128994`;
        }

        
        let htmldiv = `
        <div class="seatDiv">
        <button onclick="showSeats(this.parentElement)" class="button alt small mx-2 seatButton">Expand</button>
        <h4 style="display:inline-block">${name} ${seatColor}</h4>
        <p class="seats seatsHide">Professor: ${professor} <br>
        Status: ${status} <br>
        Currently Registered: ${currentlyRegistered} <br>
        General Seats Remaining: ${generalSeatsRemaining} <br>
        Restricted Seats Remaining: ${restrictedSeatsRemaining} <br>
        ${seatTrackButton}
        </p>
        </div>
        `;
        html += htmldiv;
        // console.log(name, course, status, currentlyRegistered, generalSeatsRemaining, restrictedSeatsRemaining, professor);
    });
    seat.innerHTML = html;
});

let showSeats = (parentElement) => {
    console.log(parentElement.children[2].classList);
    parentElement.children[2].classList.toggle("seatsHide");
}

const newTrackingUnit = new emailTracking("email", "subject", "courseNumber", "sectionNumber");
// Prompt for email when tracker button is clicked
let emailPrompt = (variable => {
    let email = prompt("Please enter your email below. ", "your email");
    let courseToTrack = variable.children[1].innerText;
    let subject = courseToTrack.substring(0,4);
    let courseNumber = courseToTrack.substring(5,8);
    let sectionNumber = courseToTrack.substring(9,12);

    // check if email is null
    if (email != null) {
        newTrackingUnit.addEmail(email, subject, courseNumber, sectionNumber);
    }

    console.log(subject);
    console.log(courseNumber);
    console.log(sectionNumber);
    console.log(email);
})

// check all emails every 30 minutes
setInterval(() => {
    newTrackingUnit.getEmails(data => {
        newTrackingUnit.emailCheck(data);
    })
}, 1800000);

// testing area to not wait 1 hour
// newTrackingUnit.getEmails(data => {
//     newTrackingUnit.emailCheck(data);
// })

// newTrackingUnit.deleteEmail("aliu5454@gmail.com", "COMM", "393", "106");
// let mailTest = new mail();
// mailTest.addMail(["toorjo123@gmail.com"], {
//     subject: "Message me if you see this email",
//     html: "Dear Toorjo, <br> I'm sending you this email from the local project. Everything is pretty much set up! We're able to send out emails when seats open up for their tracked classes. Let me know how we can better format these emails. It should look pretty rough right now. Also I just made this email account and also got a Google console account lmao. <br> <br> Best, <br> The CourseRatings Team",
// });


// PUT GRADES FOR COURSE in cards
// get grades
let grades = grades2018W;
// let facultyCode = courseName.substring(0,4);
// let courseNumber = courseName.substring(5);
console.log(facultyCode, courseNumber);

// filter grades for overall courses instead of by section and also check for courseName and courseTitle
let overallgrades = grades2018W.filter(course => {
    return course.section === "OVERALL" && course.subject == facultyCode && course.course == courseNumber;
})

// query cards from DOM
let courseAverage = document.querySelector(".course-average");
let standardDeviation = document.querySelector(".standard-deviation");
let highGrade = document.querySelector(".highest-grade");
let lowGrade = document.querySelector(".lowest-grade");
let pass = document.querySelector(".pass");
let fail = document.querySelector(".fail");

// put information into cards
courseAverage.innerHTML = overallgrades[0].stats.average;
standardDeviation.innerHTML = overallgrades[0].stats.stdev;
highGrade.innerHTML = overallgrades[0].stats.high;
lowGrade.innerHTML = overallgrades[0].stats.low;
pass.innerHTML = overallgrades[0].stats.pass;
fail.innerHTML = overallgrades[0].stats.fail;

// get grade distribution data and put into an array
delete overallgrades[0].grades["<50%"];
let gradedistribution = Object.values(overallgrades[0].grades);
// console.log(gradedistribution);

// put data into histogram
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['0-9%', '10-19%', '20-29%', '30-39%', '40-49%', '50-54%','55-59%', '60-63%','64-67%','68-71%','72-75%','76-79%','80-84%','85-89%','90-100%'],
        datasets: [{
            label: '# of students',
            data: gradedistribution,
            responsive:true,
            backgroundColor: [
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)',
                'rgba(243, 40, 83, 1)'
            ],
            // borderColor: [
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     'rgba(255, 99, 132, 1)',
            //     // 'rgba(255, 99, 132, 1)'
            // ],
            // borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

console.log(overallgrades);

// class instances
const reviewUI = new ReviewUI(reviewList);
const review = new Review("review Title", "name", "Review Text", courseName);

// Global variables
let aRating = "loading";

// Print courseName and courseTitle on top of courses page as well as description
function courseReview (courseName, courseTitle, aRating) {
    let courseDescription = localStorage.getItem("courseDescription");
    let html = `<h3>${courseName}: ${courseTitle}</h3> <br>
                <p><strong>Description: </strong>${courseDescription}</p>
                <p><strong>Overall Course Rating: </strong>${aRating}</p>
                `;
    course.innerHTML = html;
}

// Retrieve Number of Reviews in Database
review.getNumberOfReviews();


// Retrieve user review information when submit button is hit
reviewBlock.addEventListener("submit", e => {
    e.preventDefault();
    addThanks();
    const reviewTitle = reviewBlock.title.value.trim();
    const name = reviewBlock.name.value.trim();
    const reviewText = reviewBlock.reviewtext.value.trim();

    console.log(reviewTitle, name, reviewText);
    review.addReview(reviewTitle, name, reviewText, courseName, rating).then(() => {
        reviewBlock.reset();
    }).catch(err => {
        console.log(err);
    })
});

function addThanks() {
    console.log("thanks");
    let html = `<h1>Thanks for Reviewing!</h1>`;
    thanks.innerHTML=html;
}

// calls Aggregate Rating in reviews.js
review.getAggregateRating();

// get reviews from firebase database and render
review.getReviews(data => {
    reviewUI.render(data);
    // aggregateRating(data);
});

function updateCourseReview(aRating) {
    let ratingHTML = "";
    if (isNaN(aRating)) {
        ratingHTML = "No Reviews Yet. Be the first to review!";
    } else {
        ratingHTML = makeStars(aRating);
    }
    courseReview(courseName, courseTitle, ratingHTML);
}

courseReview(courseName, courseTitle, aRating);

// fill star function
let rating = {recommend: 0, difficult: 0, interesting: 0};
function fillStar(variable) {
    // change color of clicked star
    let starclass = variable.classList.value;
    let boolean = false;

    let childrenList = variable.parentElement.children;
    for(let i = 0; i < childrenList.length; i++) {
        let x = childrenList[i].classList.value;
        if (x != starclass && boolean == false) {
            childrenList[i].innerHTML = `<span style="color:#f32853;">&#9733;</span>`;
        } else if (x == starclass) {
            childrenList[i].innerHTML = `<span style="color:#f32853;">&#9733;</span>`;
            boolean = true;
            if (childrenList[i].classList.value.includes("recommend")) rating.recommend = i+1;
            else if (childrenList[i].classList.value.includes("difficult")) rating.difficult = i+1;
            else if (childrenList[i].classList.value.includes("interesting")) rating.interesting = i+1;
        } else {
            childrenList[i].innerHTML = "&#9734;";
        }
    }
    console.log(rating);
}