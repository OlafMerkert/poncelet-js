// (c) Olaf Merkert 2015

// setting up Poncelet problem
var blueCircle, redCircle;
var blueStartingPoint;

function drawPoncelet() {
    // var pc = getPonceletCanvas();
    pc.goBlue();
    if (blueCircle) {
        pc.draw(blueCircle);
    }
    pc.goBlack();
    if (blueStartingPoint) {
        pc.draw(blueStartingPoint);
    }
    pc.goRed();
    if (redCircle) {
        pc.draw(redCircle);
    }
    pc.goBlack();
}

function redrawPoncelet() {
    pc.reset();
    drawPoncelet();
}

function resetPoncelet() {
    pc.reset();
}

function PointSelector(numberOfPoints, action) {
    this.numberOfPoints = numberOfPoints;
    this.points = [];
    this.action = action;
    this.addPoint = function (event) {
        if (this.points.length < this.numberOfPoints) {
            var point = new Point(event.pageX - this.offsetX,
                                  event.pageY - this.offsetY);
            this.points.push(point);
            this.pc.draw(point);
            if (this.points.length >= this.numberOfPoints) {
                this.action(this.points);
            }
        } else {
            // clean up events
            $(this.pc.canvas).off("click");
        }
    };
    this.askNextPoint = function (pc) {
        this.pc = pc;
        if (this.points.length < this.numberOfPoints) {
            var $canvas = $(pc.canvas);
            this.offsetX = $canvas.offset().left;
            this.offsetY = $canvas.offset().top;
            var ps = this;
            $canvas.click(function (event) {
                ps.addPoint(event);
            });
        }
    };
}

function CircleSelector(pc, action) {
    var ps = new PointSelector(
        3,
        function (points) {
            var circle = circleFromPoints(points[0], points[1], points[2]);
            pc.draw(circle);
            action(circle);
        });
    ps.askNextPoint(pc);
}

function selectRedCircle() {
    // var pc = getPonceletCanvas();
    pc.goRed();
    CircleSelector(pc, function (circle) {
        redCircle = circle;
        redrawPoncelet();
    });
}

function selectBlueCircle() {
    // var pc = getPonceletCanvas();
    pc.goBlue();
    CircleSelector(pc, function (circle) {
        blueCircle = circle;
        redrawPoncelet();
    });
    // todo invalidate starting point
}

function selectStartingPoint() {
    // var pc = getPonceletCanvas();
    if (blueCircle) {
        var ps = new PointSelector(
            1,
            function (points) {
                // pc.goBlack();
                // pc.draw(points[0]);
                blueStartingPoint = blueCircle.project(points[0]);
                // pc.draw(blueStartingPoint);
                redrawPoncelet();
            });
        ps.askNextPoint(pc);
    }
}
