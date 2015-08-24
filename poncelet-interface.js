// (c) Olaf Merkert 2015

// setting up Poncelet problem
var blueCircle, redCircle;
var blueStartingPoint;
var redStartingTangent;

var currentPoncelet;

function drawPoncelet() {
    // var pc = getPonceletCanvas();
    pc.setColor("blue");
    if (blueCircle) {
        pc.draw(blueCircle);
    }
    pc.setColor("black");
    if (blueStartingPoint) {
        pc.draw(blueStartingPoint);
    }
    pc.setColor("gray");
    if (redStartingTangent) {
        pc.draw(redStartingTangent);
    }
    pc.setColor("red");
    if (redCircle) {
        pc.draw(redCircle);
    }
    pc.setColor("black");
}

function redrawPoncelet() {
    pc.reset();
    drawPoncelet();
}

function resetPoncelet() {
    pc.reset();
    currentPoncelet = undefined;
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
                // clean up events
                $(this.pc.canvas).off("click");
            }
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
    currentPoncelet = undefined;
    // var pc = getPonceletCanvas();
    pc.setColor("red");
    CircleSelector(pc, function (circle) {
        redCircle = circle;
        if (blueStartingPoint) {
            computeRedTangent();
        } else {
            redStartingTangent = undefined;
        }
        redrawPoncelet();
    });
}

function selectBlueCircle() {
    currentPoncelet = undefined;
    // var pc = getPonceletCanvas();
    pc.setColor("blue");
    CircleSelector(pc, function (circle) {
        blueCircle = circle;
        blueStartingPoint = undefined;
        redStartingTangent = undefined;
        redrawPoncelet();
        var l = new Line(blueCircle.center, new Point(0, 1));
        var p = blueCircle.intersectLine(l);
        console.log("how many intersection points: " + p.length);
        for (var i = 0; i < p.length; i++) {
            console.log("point: " + p[i].x + ", " + p[i].y);
        }
        pc.drawMany(p);
    });
}

function selectStartingPoint() {
    currentPoncelet = undefined;
    // var pc = getPonceletCanvas();
    if (blueCircle) {
        var ps = new PointSelector(
            1,
            function (points) {
                blueStartingPoint = blueCircle.project(points[0]);
                if (redCircle) {
                    computeRedTangent();
                }
                redrawPoncelet();
            });
        ps.askNextPoint(pc);
    }
}

function computeRedTangent() {
    if (redCircle && blueStartingPoint) {
        var tangents = findTangents(blueStartingPoint, redCircle);
        if (tangents.length > 0) {
            redStartingTangent = tangents[0];
        } else {
            throw new GeometricMisconfiguration("compute-tangent");
        }
    }
}

function GeometricMisconfiguration(operation) {
    this.message = "The configuration of the circles and points makes it impossible to perform the required geometric constructions.";
    this.operation = operation;
}

function ponceletChangePoint(point, tangent) {
    // select the other point on tangent
    var points = blueCircle.intersectLine(tangent);
    if (points.length == 0) {
        throw new GeometricMisconfiguration("change-point");
    } else if (points.length > 1) {
        if (points[0].equal(point)) {
            return points[1];
        } else {
            return points[0];
        }
    } else {
        // if the intersection is a single point, no change
        return point;
    }
}

function ponceletChangeTangent(point, tangent) {
    // select the other tangent
    var tangents = findTangents(point, redCircle);
    if (tangents.length == 0) {
        throw new GeometricMisconfiguration("change-tangent");
    } else if (tangents.length > 1) {
        if (tangents[0].equal(tangent)) {
            return tangents[1];
        } else {
            return tangents[0];
        }
    } else {
        return tangent;
    }
}

function ponceletNextStep(args) {
    var nextPoint, nextTangent;
    nextPoint = ponceletChangePoint(args.point, args.tangent);
    pc.setColor("black");
    pc.draw(nextPoint);
    nextTangent = ponceletChangeTangent(nextPoint, args.tangent);
    pc.setColor("lightgray");
    pc.draw(nextTangent);
    return {"point": nextPoint, "tangent": nextTangent};
}

function drawStep(args) {
    pc.setColor("black");
    pc.draw(args.point);
    pc.setColor("gray");
    pc.draw(args.tangent);
}

function ponceletStep() {
    if (blueCircle && redCircle && blueStartingPoint) {
        if (!redStartingTangent) {
            computeRedTangent();
            redrawPoncelet();
        }
        if (!currentPoncelet) {
            currentPoncelet = {"point": blueStartingPoint,
                               "tangent": redStartingTangent};
        }
        try {
            currentPoncelet = ponceletNextStep(currentPoncelet);
            // drawStep(currentPoncelet);
        } catch(e) {
            console.log("Exception: " + e.message + " in " + e.operation);
        }
    } else {
        // TODO alert user
    }
}
