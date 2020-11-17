// render the review templates to the DOM

class ReviewUI {
    constructor(list) {
        this.list = list;
    }

    render(data) {
        const when = dateFns.distanceInWordsToNow(
            data.created_at.toDate(),
            {addSuffix: true}
        );
        console.log(data.name);
        let recommend = makeStars(data.rating.recommend);
        let difficult = makeStars(data.rating.difficult);
        let interesting = makeStars(data.rating.interesting);
        // console.log(recommend);

        const html =`
        <li class = "list-group-item">
            <span class="reviewTitle"><span style="font-weight:bold;">Review Title:</span> ${data.reviewTitle}<br></span>
            <span class="name"><span style="font-weight:bold;">Name:</span> ${data.name}<br></span>
            <span class="ratings"><span style="font-weight:bold;">Would Recommend:</span> ${recommend} <br class="mobile-br"><span style="font-weight:bold;">Difficult:</span> ${difficult} <br class="mobile-br"> <span style="font-weight:bold;">Interesting:</span> ${interesting}<br></span>
            <span class="reviewText"><span style="font-weight:bold;">Review:</span> ${data.reviewText}</span>
            <div class="time">${when}</div>
        </li>
        `;
        this.list.innerHTML += html;
    }

    clear() {
        this.list.innerHTML = "";
    }
}

function makeStars(rating) {
    let boolean = false;
    let html = '';
    for(let i = 0; i < 5; i++) {
        if (rating != (i + 1) && boolean == false) {
            html += `<span style="color:#f32853;">&#9733;</span>`;
        } else if (rating == (i+1)) {
            boolean = true;
            html += `<span style="color:#f32853;">&#9733;</span>`;
        } else {
            html += `<span>&#9734;</span>`;
        }
    }
    return html;
}