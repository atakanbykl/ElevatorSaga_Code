{
    init: function (elevators, floors) {
        let midFloor = Math.round(floors.length / 2);
        let elevatorCallIndex = 0;

        //------elevator funcs-------
        for (let i = 0; i < elevators.length; i++) {
            // elevators[i].on("idle", function () {
            //     elevators[i].goToFloor(midFloor);
            // });

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
                // que manipulation-----------------
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
                //-------------------
            });
        }

        // ---------floor funcs-------
        for (let i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed", function () {
                let breakFlag = false;
                for (let j = 0; j < elevators.length; j++) {
                    if (elevators[j].loadFactor() < 0.1) {
                        elevators[j].goToFloor(i);
                        break;
                    }
                }
                if (!breakFlag) {
                    for (let j = 0; j < elevators.length; j++) {
                        if (elevators[j].loadFactor < 0.8) {
                            if (elevators[j].currentFloor() < i) {
                                elevators[j].goToFloor(i);
                                breakFlag = true;
                                break;
                            } else if (i == 0) {
                                elevators[j].goToFloor(i);
                                breakFlag = true;
                                break;
                            }
                        }
                        if (j == elevators.length - 1) elevators[j].goToFloor(i); //if none of above cases applied, send last elevator
                    }
                }
            });
            floors[i].on("down_button_pressed", function () {
                let breakFlag = false;
                for (let j = 0; j < elevators.length; j++) {
                    if (elevators[j].loadFactor() < 0.1) {
                        elevators[j].goToFloor(i);
                        breakFlag = true;
                        break;
                    }
                }
                if (!breakFlag) {
                    for (let j = 0; j < elevators.length; j++) {
                        if (elevators[j].loadFactor < 0.8) {
                            if (elevators[j].currentFloor() > i) {
                                elevators[j].goToFloor(i);
                                break;
                            } else if (i == floors.length - 1) {
                                elevators[j].goToFloor(i);
                                break;
                            }
                        }
                        if (j == elevators.length - 1) elevators[j].goToFloor(i); //if none of above cases applied, send last elevator
                    }
                }
            });
        }
    },
    update: function (dt, elevators, floors) {
        for (let i = 0; i < elevators.length; i++) {
            // make the que unique------------
            // elevators[i].destinationQueue = elevators[i].destinationQueue.filter(function (value, index, self) {
            //     return self.indexOf(value) === index;
            // });
            // elevators[i].checkDestinationQueue();
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