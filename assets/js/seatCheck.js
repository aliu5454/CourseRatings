let allSeats = getAllSeats().then(seatData => {
    // console.log(seatData);
    return seatData;
});

// console.log(allSeats);

async function getAllSeats() {
    let fetchURL = `https://api.ubccourses.com/sectionInfo`;
    // let fetchURL = `https://api.ubccourses.com/sectionInfo/${facultyCode}/${courseNumber}?realtime=1`;
    let response = await fetch(fetchURL);
    let data = await response.json();
    return data;
};

function checkSeatOpen(data) {
    let didSeatOpenUp = false;
    Promise.resolve(allSeats).then(seatdata => {
        // filter through seat Data to match data
        let filteredClass = seatdata.filter(course => {
            return data.faculty == course.subject && data.courseNumber == course.course && data.sectionNumber == course.section;
        })
        // console.log(filteredClass);
        if (filteredClass.length == 1) {
            // console.log(filteredClass[0]);
            if (filteredClass[0].general_seats_remaining > 0 || filteredClass[0].restricted_seats_remaining > 0) {
                // a seat has opened up
                didSeatOpenUp = true;
            }
        }
    })
    return didSeatOpenUp;
}