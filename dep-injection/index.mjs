class Bike {
    constructor(first, second) {
        this.wheel1 = first;
        this.wheel2 = second;
    }

    specification() {
        let message = `${this.wheel1.label} wheel diameter = ${this.wheel1.diameter}`;
        message += `, ${this.wheel2.label} wheel diameter = ${this.wheel2.diameter}`;

        return message;
    }
}

class Wheel {
    constructor(label, diameter) {
        this.label = label;
        this.diameter = diameter;
    }
}

const frontWheel = new Wheel("Front", 126);
const backWheel = new Wheel("Back", 42);

const bike = new Bike(frontWheel, backWheel);

console.log(bike);

console.log("Bike specification:", bike.specification());
