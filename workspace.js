{
    init: function (elevators, floors) {
        let midFloor = Math.round(floors.length / 2);
        let elevatorCallIndex = 0;

        //------elevator funcs-------
        for (let i = 0; i < elevators.length; i++) {
            elevators[i].on("idle", function () {
                elevators[i].goToFloor(midFloor);
            });

            elevators[i].on("floor_button_pressed", function (floorNum) {
                elevators[i].goToFloor(floorNum);
            });

            elevators[i].on("stopped_at_floor", function (floorNum) {
                if (floorNum == 0) {
                    elevators[i].goingDownIndicator(false);
                    elevators[i].goingUpIndicator(true);
                } else if (floorNum == floors.length - 1) {
                    elevators[i].goingDownIndicator(true);
                    elevators[i].goingUpIndicator(false);
                }
            });


            elevators[i].on("passing_floor", function (floorNum, direction) {
                let que = elevators[i].destinationQueue;
                if (direction == "down") { // going down
                    let queSearchIndex = 1;
                    while (queSearchIndex < que.length) {
                        if (que[queSearchIndex] != floorNum) queSearchIndex++;
                        else {
                            let temp = que[0];
                            que[0] = que[queSearchIndex];
                            que[queSearchIndex] = temp;

                            elevators[i].destinationQueue = que;
                            elevators[i].checkDestinationQueue();
                            break;
                        }
                    }
                } else if (direction == "up") { // going up
                    console.log("debug");
                    let queSearchIndex = 1;
                    while (queSearchIndex < que.length) {
                        if (que[queSearchIndex] != floorNum) queSearchIndex++;
                        else {
                            let temp = que[0];
                            que[0] = que[queSearchIndex];
                            que[queSearchIndex] = temp;

                            elevators[i].destinationQueue = que;
                            elevators[i].checkDestinationQueue();
                            break;
                        }
                    }
                }
            });
        }


        // ---------floor funcs-------
        for (let i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed", function () {
                elevators[elevatorCallIndex % elevators.length].goToFloor(i);
                elevatorCallIndex++;
                console.log("up button pressed! elevator " + elevatorCallIndex % elevators.length + " goint to " + i);
            });
            floors[i].on("down_button_pressed", function () {
                elevators[elevatorCallIndex % elevators.length].goToFloor(i);
                elevatorCallIndex++;
                console.log("down button pressed! elevator " + elevatorCallIndex % elevators.length + " goint to " + i);
            });
        }
    },
    update: function (dt, elevators, floors) {
        function uniqueArray(value, index, self) {
            return self.indexOf(value) === index;
        }

        for (let i = 0; i < elevators.length; i++) {

            // make the que unique------------
            elevators[i].destinationQueue = elevators[i].destinationQueue.filter(uniqueArray);
            elevators[i].checkDestinationQueue();
            // -------------------------------

            // indicator manuplation----------
            if (elevators[i].destinationDirection() == "up") {
                let continiuUpFlag = false;
                elevators[i].destinationQueue.forEach(function (quedFloor) {
                    if (quedFloor > elevators[i].currentFloor()) {
                        continiuUpFlag = true;
                    }
                });

                if (continiuUpFlag == true) {
                    elevators[i].goingDownIndicator(false);
                    elevators[i].goingUpIndicator(true);
                } else {
                    elevators[i].goingDownIndicator(true);
                    elevators[i].goingUpIndicator(true);
                }
            } else if (elevators[i].destinationDirection() == "down") {
                let continiuUpFlag = false;
                elevators[i].destinationQueue.forEach(function (quedFloor) {
                    if (quedFloor < elevators[i].currentFloor()) {
                        continiuUpFlag = true;
                    }
                });

                if (continiuUpFlag == true) {
                    elevators[i].goingDownIndicator(true);
                    elevators[i].goingUpIndicator(false);
                } else {
                    elevators[i].goingDownIndicator(true);
                    elevators[i].goingUpIndicator(true);
                }
            }
            //--------------------------------
        }
    }
}