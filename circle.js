class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dr = 1;
    }
    display() {
        noFill();
        stroke(250, 175, 255);
        
        ellipse(this.x, this.y, this.r*5, 
    this.r*5);
    }

    move() {
        if (this.r > 220 || this.r < 0) {
            this.dr = this.dr * -1;
        }
        this.r = this.r + this.dr;
    }
}
