/* 
roll a 6-sided dice,
    - count number of rolls until you get:
        * a 6 DONE
        * a cumulative total > 100 DONE*
            * everytime the cumulative total is at or above 100 it counts as a 'play' and resets 
        
    - count number of times you can get a certain number in a row DONE
        * output when new highest row length is acheived DONE
    - count how many times needed to play until total == 100 DONE
        * 1 'play' = any time the total is over or at 100 DONE
    - output how many times each number is rolled when dice is rolled 100 000 000 000 times KIND OF DONE
 */

// variables
let dice,data;
data = { // dictionary of data about the session, i.e. number of rolls, plays, total
    rollNum : 0,
    playNum : 0,
    trackedNumber : null,
    longestRow : {
        1 : 0,
        2 : 0,
        3 : 0,
        4 : 0,
        5 : 0,
        6 : 0
    },
    lastNum : null,
    rowCount : 0,
    cumulativeTotal : 0,
    events : {
        cumulTotalGoal : false
    },
    distribution : {
        1 : 0,
        2 : 0,
        3 : 0,
        4 : 0,
        5 : 0,
        6 : 0
    }
};

// main
document.getElementById("rollButton").onclick = function() { // runs roll code when event onclick is satisfied (i.e the roll button is clicked)
    let rollsToPerform = document.getElementById("rollUntilNum").value;
    if (data.trackedNumber !== document.getElementById("numToTrack").value) {
        data.rowCount = 0;
        data.trackedNumber = document.getElementById("numToTrack").value;
    }
    
    for (let i = 0; i < rollsToPerform; i++) {
        rollDice();
        data.rollNum++;
        data.cumulativeTotal += dice;
        data.distribution[dice]++; // increments whichever number is rolled by the dice in data.distribution
        if (data.cumulativeTotal >= 100) { // checks if cumulative total is greater or equal to 100
            data.playNum++; // increments the number of plays 
            if (data.cumulativeTotal == 100 && !data.events.cumulTotalGoal) { // checks if the total is EXACTLY 100, and if this hasn't already previously occurred
                notifyEvent(`Took ${data.playNum} ${pluralize(data.playNum, "play")} to get an exact total of 100`); // creates html notification of cumulative total event
                data.events.cumulTotalGoal = true;
            }
            data.cumulativeTotal = 0;
        }

        if (dice == 6 && data.distribution[6] == 0) { // checks if the dice has rolled a 6, and if it hasn't happened before
            notifyEvent(`Took ${data.rollNum} ${pluralize(data.rollNum, "roll")} to get a 6`);
        }

        if (data.lastNum == data.trackedNumber) { // checks if the number rolled is the same one as before
            data.rowCount++; // increases the row count
        } else {
            data.rowCount = 0; // otherwise sets the row count back to zero
        }

        if (data.rowCount > data.longestRow[data.trackedNumber]) { // this checks if the current rowcount is greater than the highest row count
            data.longestRow[data.trackedNumber] = data.rowCount;
            notifyEvent(`Longest row achieved while tracking number ${data.trackedNumber} with a length of ${data.longestRow[data.trackedNumber]} ${pluralize(data.longestRow[data.trackedNumber], "row")}`, data.trackedNumber);
        }
        data.lastNum = dice; // sets the last number rolled to the current number of the dice
    }
    updatePage(); // updates the page after the loop is complete
}

// functions
const isPlural = num => Math.abs(num) !== 1; // checks if the absolute value of num is greater than 1, returns boolean
const simplePlural = word => `${word}s`; // converts a word to its simple plural form (adds and s to the end of it)
const pluralize = (num, word, plural = simplePlural) => // pluralizes a word based on a number. The plural form is able to be changed (i.e. word => `radii` for the word radius/radii)
    isPlural(num) ? plural(word) : word; // one line conditional

function rollDice() { // rolls dice (i.e. randomly generates numbers 1 through 6 and assigns value to dice)
    dice = getRndInteger(1, 6);
}

function getRndInteger(min, max) { // generates a random integer between min to max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updatePage() { // updates tables in html with values from data
    document.getElementById("rollNum").innerHTML = data['rollNum'];
    document.getElementById("playNum").innerHTML = data['playNum'];
    document.getElementById("cumulativeTotal").innerHTML = data['cumulativeTotal'];

    let distTable = document.getElementById("distribution");
    let row = distTable.getElementsByTagName("tr");
    for (let i = 0; i < row.length; i++) { // loops through distribution table rows
        row[i].getElementsByTagName("td")[1].innerHTML = data.distribution[i + 1]; // updates table values with ones from data.distribution 
    }
}

function notifyEvent(event, id = null) { // creates html event notification as a new paragraph
    if (document.getElementById(id) !== null) { // checks if theres already an element with the existing ID
        updateEvent(event, id) // updates the element rather than creating a new one
    } else {
        const NEW_PARAGRAPH = document.createElement('p');
        NEW_PARAGRAPH.textContent = event;
        if (id !== null) { // if the id parameter has been entered
            NEW_PARAGRAPH.id = id; // give the new element the specified id
        }
        document.body.appendChild(NEW_PARAGRAPH); // append new element to body
    }
}

function updateEvent(msg, id) { // takes in the message and id of element
    let element = document.getElementById(id);
    element.innerHTML = msg; // updates event message
}


