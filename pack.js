class Pack {
    constructor(x, y, n, size, startAngle) {
        this.packx = x;
        this.packy = y;
        this.pack = [];

        this.n = n;
        this.angle = size/this.n;
        this.packr = 150;
        this.startAngle = startAngle;
        this.createCircles();
    }

    createCircles(){
        let scl = 0.1;
        for(let i = 0; i < this.n; i++) {
            this.pack[i] = new Circle(this.packx +
this.packr*cos(this.startAngle + this.angle*i),
this.packy + this.packr*sin(this.startAngle +this.angle*i), (i + 1)*scl*25);

        }
    }

    displayPack() {
        for( let i=0; i<this.n; i++){
            this.pack[i].display();
            this.pack[i].move();
        }
    }
    movePack(speed){
        this.startAngle += speed;
        for (let i=0; i<this.n; i++) {
            this.pack[i].x = this.packx + this.packr*cos(this.startAngle + this.angle*i);
            this.pack[i].y = this.packy + this.packr*sin(this.startAngle + this.angle*i);
            print(this.pack[i].x, this.pack[i].y);
        }
    }
}