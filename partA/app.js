const MathOperations = require('./modules/math');

class DebuggerApp {

    constructor() {
        this.math = new MathOperations();
    }

    run() {
        const num1 = 15;
        const num2 = 5;
        const sum = this.math.add(num1, num2);
        const diff = this.math.subtract(num1, num2);

        // This is where I will be placing a breakpoint below.
        console.log(`Hello Jaspreet. The sum is ${sum} and the difference is ${diff}`);
    }
}

const app = new DebuggerApp();
app.run();