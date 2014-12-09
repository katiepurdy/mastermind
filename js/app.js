$(document).on('click', '.current-row .guess-dot' , function() {
    if (!gameOver) {
      // If a dot in the current row is clicked, change its colour
      $(this).css('background-color', currentColour);
      isTestable();
      if (testable) {
        $('#test-guess').addClass('highlighted');
      }
    }
});

var colours = {
  pink: 'rgb(209, 2, 108)',
  orange: 'rgb(255, 85, 33)',
  yellow: 'rgb(242, 212, 63)',
  green: 'rgb(97, 193, 85)',
  teal: 'rgb(4, 128, 145)',
  purple: 'rgb(73, 45, 97)',
  mediumgrey: '#666',
  grey: '#333'
};
var currentColour = colours.pink;
var previousColour;
var secretGuess = [];
var currentGuess = [];
var currentRow = $('.current-row');
var numGuesses = 0;
var testable = false;
var message;
var isWinner = false;
var gameOver = false;

// Randomly generate an array of secret dot colours from the colours object
function generateSecretGuess() {
  var randomNumber;
  for (var i = 0; i < 4; i++) {
    randomNumber = Math.ceil(Math.random() * (6 - 1));
    console.log(randomNumber);
    switch (randomNumber) {
      case 1:
        secretGuess.push(colours.pink);
        break;
      case 2:
        secretGuess.push(colours.orange);
        break;
      case 3:
        secretGuess.push(colours.yellow);
        break;
      case 4:
        secretGuess.push(colours.green);
        break;
      case 5:
        secretGuess.push(colours.teal);
        break;
      case 6:
        secretGuess.push(colours.purple);
        break;
    }
  }
}

// Highlight the next guess row and unhighlight the "Test Your Guess" button
function moveToNextRow() {
  var currentRow;
  currentRow = $('.current-row');
  $('#test-guess').removeClass('highlighted');
  $('.current-row').find('.guess-dot').each(function() {
    $(this).removeClass('selected');
  });
  currentRow = currentRow.prev('.guess');
  currentRow.addClass('current-row');
  currentRow.next('.guess').removeClass('current-row');
  currentRow.find('.guess-dot').each(function() {
    $(this).addClass('selected');
  });
  numGuesses++;
}

// Change the colour of the secret dots at the top of the board
function displaySecretGuess() {
  $('.secret-dot').each(function(index) {
    $(this).css('background-color', secretGuess[index]);
  });
}

// Determines whether the guess is an outright win or not
function isCorrectGuess() {
  // Update the currentGuess array with the current row's colours
  $('.current-row .guess-dot').each(function(index) {
    currentGuess[index] = $(this).css('background-color');
  });
  // Compare it to secretGuess array
  if (currentGuess[0] == secretGuess[0] &&
      currentGuess[1] == secretGuess[1] &&
      currentGuess[2] == secretGuess[2] &&
      currentGuess[3] == secretGuess[3]) {
    return true;
  } else {
    return false;
  }
}

// Get the amount of pegs to display as a hint
function getPegs() {
  var i;
  var pegCount = {
    black: 0,
    grey: 0
  };
  var secretGuessCopy = secretGuess.slice();
  console.log('Secret Guess: ' + secretGuessCopy);
  console.log('Current Guess: ' + currentGuess);
  // Count black pegs (correct positions)
  for (i = 0; i < 4; i++) {
    if (currentGuess[i] == secretGuessCopy[i]) {
      pegCount.black += 1;
      secretGuessCopy[i] = null;
    }
  }
  // Check for grey pegs (incorrect positions)
  for (i = 0; i < 4; i++) {
    if (secretGuessCopy.indexOf(currentGuess[i]) != -1) {
      pegCount.grey += 1;
    }
  }
  if (pegCount.black < pegCount.grey) {
    pegCount.grey = pegCount.grey - pegCount.black;
  }
  return pegCount;
}

// Display another peg hint image in the current row
function displayPegHint(pegCount) {
  var pegs = pegCount;
  // Traverse to the empty peg hint and add the image
  $('.current-row .peg-hint').css('background', 'white url(images/' + 'black-' + pegs.black + '-grey-' + pegs.grey + '.png)');
  console.log('Displaying peg hint');
}

// Check if all dots in the current row have been assigned a colour
function isTestable() {
  testable = true;
  // Row is testable if no dots pass this test
  $('.current-row .guess-dot').each(function(index) {
    if ($(this).css('background-color') == 'rgb(51, 51, 51)' || gameOver) {
      testable = false;
    }
    // Add the colours to the currentGuess array
    currentGuess[index] = $(this).css('background-color');
  });
}

// Display a message to the user, show secret code, and highlight "Play again?
function endGame() {
  gameOver = true;
  displaySecretGuess();
  if (isWinner) {
    message = "Congrats! You win."
  } else {
    message = "Awh... you lose."
  }
  $('#message').text(message);
  $('#reveal').removeClass('highlighted');
  $('#play-again').addClass('highlighted');
}

// Select a colour option
$('.colour-option').click(function() {
  if (!gameOver) {
    currentColour = $(this).css('background-color');
    $('.colour-option').removeClass('selected');
    $(this).addClass('selected');
  }
});

// Reveal the secret code and end the game
$('#reveal').click(function() {
  // Unhighlight reveal button
  $(this).removeClass('highlighted');
  displaySecretGuess();
  endGame();
});

// Test the user's guess after they press the test button
$('#test-guess').click(function() {
  var pegs = getPegs();
  if (!gameOver) {
    displayPegHint(pegs);
    if (isCorrectGuess()) {
      isWinner = true;
    }
    if (isWinner === true) {
      endGame();
    }
    if (numGuesses < 9) {
      moveToNextRow();
    } else {
      $('.current-row').find('.guess-dot').each(function() {
        $(this).removeClass('selected');
      });
      $('.current-row').removeClass('current-row');
      endGame();
    }
  }
});

// Force a page refresh when the "Play Again?" button is pressed
$('#play-again').click(function() {
    window.location.href = window.location.href;
});

// Start game!
generateSecretGuess();