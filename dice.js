/* 
roll a 6-sided dice,
    - count number of rolls until you get:
        * a 6
        * a cumulative total > 100
        
    - count number of times you can get a certain number in a row
        * output when new highest row length is acheived
    - count how many times needed to play until total == 100
        * 1 'play' = any time the total is over or at 100
    - output how many times each number is rolled when dice is rolled 100 000 000 000 times
 */

let dice,data;
data = { // dictionary of data about the session, i.e. number of rolls, plays, total
    rollNum : 0,
    playNum : 0,
    cumulativeTotal : 0,
    cumulTotalGoal : false,
    distribution : {
        1 : 0,
        2 : 0,
        3 : 0,
        4 : 0,
        5 : 0,
        6 : 0
    }
};


document.getElementById("rollButton").onclick = function(){
    let rollsToPerform = document.getElementById("rollUntilNum").value;
    for (let i = 0; i < rollsToPerform; i++) {
        rollDice();
        data.rollNum++;
        data.cumulativeTotal += dice;
        if (data.cumulativeTotal >= 100) {
            data.playNum++;
            if (data.cumulativeTotal == 100 && !data.cumulTotalGoal) {
                notifyEvent("Took " + data.playNum + " plays to get an exact total of 100")
                data.cumulTotalGoal = true;
            }
            data.cumulativeTotal = 0;
        }
    }
    updatePage();
}

// functions
function rollDice() {
    dice = getRndInteger(1, 6);
}

function getRndInteger(min, max) { // generates a random integer between min to max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updatePage() {
    document.getElementById("rollNum").innerHTML = data['rollNum'];
    document.getElementById("playNum").innerHTML = data['playNum'];
    document.getElementById("cumulativeTotal").innerHTML = data['cumulativeTotal'];

    let distTable = document.getElementById("distribution");
    let row = distTable.getElementsByTagName("tr");
    for (let i = 0; i < row.length; i++) {
        row[i].getElementsByTagName("td")[1].innerHTML = data.distribution[i + 1];
    }
}

function notifyEvent(event) {
    const NEW_PARAGRAPH = document.createElement('p');
    NEW_PARAGRAPH.textContent = event;
    document.body.appendChild(NEW_PARAGRAPH);
}
