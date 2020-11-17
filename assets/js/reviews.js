class Review {
    constructor(reviewTitle, name, reviewText, courseName, rating) {
        this.reviewTitle = reviewTitle;
        this.name = name;
        this.reviewText = reviewText;
        this.courseName = courseName;
        this.rating = rating;
        this.reviews = db.collection('Reviews');
    }

    // function for adding review to firebase database
    async addReview(reviewTitle, name, reviewText, courseName, rating) {
        // format a review object
        const now = new Date();
        const review = {
            reviewTitle: reviewTitle,
            name: name,
            reviewText: reviewText,
            courseName: courseName,
            rating: rating,
            created_at: firebase.firestore.Timestamp.fromDate(now),
        }

        const response = await this.reviews.add(review);
        console.log("this is the response promise from addReview: ", response)
        return response;
    };

    // function for retrieving info from firebase database
    getReviews(callback) {
        // console.log(this.reviews, this.courseName);
        this.reviews
        .where("courseName", "==", this.courseName)
        .orderBy("created_at") // need to reverse this
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type === "added") {
                    // update UI
                    callback(change.doc.data());
                }
            })
        });
    }

    // function for retrieving aggregate rating of all reviews of a course
    getAggregateRating() {
        let aggregateRating = 0;
        let numberOfReviews = 0;
        this.reviews
        .where("courseName", "==", this.courseName)
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    numberOfReviews ++;
                    let recommend = change.doc.data().rating.recommend;
                    let difficult = change.doc.data().rating.difficult;
                    let interesting = change.doc.data().rating.interesting;
                    let average = (recommend + difficult + interesting) / 3;
                    aggregateRating += Math.round(average); 
                }
            })
            let divide = Math.round(aggregateRating/numberOfReviews);
            console.log(divide);
            // this calls a courseReview in courses.js
            updateCourseReview(divide);
        })
    }

    getNumberOfReviews() {
        this.reviews.get().then(snap => {
            console.log("Number of Reviews:", snap.size);
        });
    }
}

// const review = new Review();
// review.addReview("class1", "user1", "review text").then(() => {
//     console.log("review added to database");
// }).catch(err => {
//     console.log(err);
// });

