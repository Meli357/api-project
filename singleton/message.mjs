class Message {
    constructor(message) {
        this.content = message;
    }

    output(message) {
        this.content = message;
        console.log("Newgreet:", message);
    }
}

export const MessageInstance = new Message();

/*
-->used as an object literal:
export const MessageInstance = {
    content: "",
    output(message) {
        this.content = message;
        console.log("Newgreet:", message);
    },
};
 */
