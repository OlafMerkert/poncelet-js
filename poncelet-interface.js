// (c) Olaf Merkert 2015

// setting up Poncelet problem
var blueCircle, redCircle;

function selectRedCircle() {
    // var pc = getPonceletCanvas();
    pc.goRed();
    CircleSelector(pc, function (circle) {
        redCircle = circle;
    });
}

function selectBlueCircle() {
    // var pc = getPonceletCanvas();
    pc.goBlue();
    CircleSelector(pc, function (circle) {
        blueCircle = circle;
    });
    // todo invalidate starting point
}

var blueStartingPoint;

function selectStartingPoint() {
    // var pc = getPonceletCanvas();
    if (blueCircle) {
        var ps = new PointSelector(
            1,
            function (points) {
                pc.goBlack();
                pc.draw(points[0]);
                blueStartingPoint = blueCircle.project(points[0]);
                pc.draw(blueStartingPoint);
            });
        ps.askNextPoint(pc);
    }
}

function drawPoncelet() {
    // var pc = getPonceletCanvas();
    pc.goBlue();
    if (blueCircle) {
        pc.draw(blueCircle);
    }
    pc.restoreColor();
    pc.goBlack();
    if (blueStartingPoint) {
        pc.draw(blueStartingPoint);
    }
    pc.restoreColor();
    pc.goRed();
    if (redCircle) {
        pc.draw(redCircle);
    }
    pc.restoreColor();
}

