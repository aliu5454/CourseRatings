class emailTracking {
    constructor(email, faculty, courseNumber, sectionNumber) {
        this.email = email;
        this.faculty = faculty;
        this.courseNumber = courseNumber;
        this.sectionNumber = sectionNumber;
        this.emailTracking = db.collection('EmailTracking');
    }

    async addEmail(email, faculty, courseNumber, sectionNumber) {
        const now = new Date();
        const emailTrack = {
            email: email,
            faculty: faculty,
            courseNumber: courseNumber,
            sectionNumber: sectionNumber,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        }
        const response = await this.emailTracking.add(emailTrack);
        console.log("this is the response promise from emailTracking: ", response);
        return response;
    }

    deleteEmail(email, faculty, courseNumber, sectionNumber) {
        this.emailTracking
        .where("email", "==", email)
        .where("faculty", "==", faculty)
        .where("courseNumber", "==", courseNumber)
        .where("sectionNumber", "==", sectionNumber)
        .onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                // this.emailTracking.delete(doc.ref);
                this.emailTracking.doc(doc.id).delete().then(() => {
                    console.log("just deleted", doc.id);
                })
            })
        })
    }

    // retrive emails from firebase
    getEmails(callback) {
        this.emailTracking
        .orderBy("created_at")
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type === "added") {
                    // do stuff with all emails in the database (check for time, check for seats, etc)
                    // console.log("going through emails");
                    callback(change.doc.data());
                }
            })
        })
    }

    // this is called every hour - goes through all emails
    // check how long it has been in the database, if over 3 weeks, take it out of the database
    // check if any of the emails in the database has a seat open, if so, push to email collection
    emailCheck(data) {
        // console.log(data);
        // 3 weeks in seconds = 1814400 seconds
        // check time
        // need to adjust if statement 
        const now = new Date();
        // console.log(now);
        let differenceInTime = now.getTime() - data.created_at.toDate().getTime();
        let differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (differenceInDays > 21) {
            // remove from colletion
            this.deleteEmail(data.email, data.faculty, data.courseNumber, data.sectionNumber);
        }
        // check if seats are open
        if (checkSeatOpen(data)) {
            // if seat are open, push to second collection
            // construct "to" array and message object to push to collection
            let mailObject = new mail();
            let toArray = [data.email];
            let message = {
                subject: `A seat in ${data.faculty} ${data.courseNumber} ${data.sectionNumber} has opened up!`,
                html: `Hi! <br> You are receiving this email because a seat in the class you are tracking 
                (${data.faculty} ${data.courseNumber} ${data.sectionNumber}) has opened up. Hurry and login 
                to ssc to register for the class! <br> <br>
                Best, <br>
                The CourseRatings Team`,
            }
            mailObject.addMail(toArray, message);
            console.log("im here");
        }
        // console.log(data.email,data.faculty, data.courseNumber, data.sectionNumber);
    }
}
