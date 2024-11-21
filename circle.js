class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dr = 1;
        this.strokeC = color(random(0,250), random(0,175), random(0,255));
    }
    display() {
        noFill();
        if(changeColor){
            this.strokeC = color(255);
        }
        stroke(this.strokeC);
        
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
