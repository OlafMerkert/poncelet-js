// (c) Olaf Merkert 2015

// tests for canvas-helper.js

function testDrawPointCircle(pc) {
    var p1 = new Point(20, 20);
    var p2 = new Point(40, 20);
    var c1 = new Circle(new Point(100, 100), 50);
    pc.drawBlue(p1);
    pc.drawRed(p2);
    pc.draw(c1);
}

function testCircle3Points(pc) {
    var points = [new Point(150, 10), new Point(150, 100), new Point(200, 50)];
    var circle = circleFromPoints(points[0], points[1], points[2]);
    pc.drawMany(points);
    pc.draw(circle);
}

function testBlueCircleLineIntersection() {
    var l = new Line(blueCircle.center, new Point(0, 1));
    var p = blueCircle.intersectLine(l);
    console.log("how many intersection points: " + p.length);
    for (var i = 0; i < p.length; i++) {
        console.log("point: " + p[i].x + ", " + p[i].y);
    }
    pc.drawMany(p);
}
