class mail {
    constructor(to, message) {
        this.to = to;
        this.message = message;
        this.mail = db.collection('mail');
    }

    async addMail(to, message) {
        const mailToPush = {
            to: to,
            message: message,
        }
        const response = await this.mail.add(mailToPush);
        console.log("this is the response promise from addMail", response);
        return response;
    }
}