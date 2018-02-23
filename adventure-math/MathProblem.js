/*
 * Class representing a simple math problem (either addition or subtraction)
 * and the phaser UI components that comprise the problem.
 */
class MathProblem {
  /*
   * Constructor for MathProblem class and skeletal UI.
   *
   * Iniatilizes all member properties, pauses the phaser game and constructs
   * a UI panel with arithmetic operation of type operation centered at
   * x_pos, y_pos.
   *
   * Args:
   *   game (type: Phaser.Game): the current game to which the MathProblem will
   *     will be added
   *   x_pos (type: int): the x coordinate where the center of the math panel
   *     will be anchored
   *   y_pos (type: int): the y coordinate where the center of the math panel
   *     will be anchored
   *   operation (type: string): the type of operation that the MathPanel will
   *     prompt to the user. Possible values are: 'addition', 'subtraction'
   *   solved_cb (type: function): an optional parameter. this function will
   *     be called when the mathproblem has been correctly solved.
   */
  constructor(game, x_pos, y_pos, operation, solved_cb = null) {
    this.game = game;
    this.game.paused = true;
    this.operation = operation;
    this.problemGenerated = false;
    this.solved_cb = solved_cb;
    this.math_panel = null;

    if (this.operation === "addition") {
      this.math_panel = this.game.add.sprite(x_pos, y_pos, 'addition_panel');
    } else if (this.operation === "addition") {
      this.math_panel = this.game.add.sprite(x_pos, y_pos, 'subtraction_panel');
    }
    this.math_panel.anchor.setTo(0.5); // center the sprite

    this.number_buttons = [
      {"text": "0", "button": null},
      {"text": "1", "button": null},
      {"text": "2", "button": null},
      {"text": "3", "button": null},
      {"text": "4", "button": null},
      {"text": "5", "button": null},
      {"text": "6", "button": null},
      {"text": "7", "button": null},
      {"text": "8", "button": null},
      {"text": "9", "button": null}
    ];

    // Add solution buttons to the panel, coordinates are relative to center
    // of panel
    let x_position = this.math_panel.position.x - 100;
    let y_top_position = this.math_panel.position.y + 125;
    let y_bot_position = y_top_position + 54;
    let y_position = y_top_position;
    let separation = 50;
    for (let num = 0; num < 10; num++) {
      if (num === 5) { // switch to lower row
        y_position = y_bot_position;
        x_position = this.math_panel.position.x - 100;
      }
      // bind attemptSolution to the button being pressed
      let attemptSolution = this._attemptSolution.bind(this, num.toString());
      this.number_buttons[num].button =
        this.game.add.button(x_position, y_position, num.toString(),
          attemptSolution, this);
      this.number_buttons[num].button.anchor.setTo(0.5);
      x_position += separation;
    }


    this.operands = {
      "top": {
        "upperbound": 9,
        "lowerbound": 5,
        "value": "", // string
        "sprites": null
      },
      "bot": {
        "upperbound": 5,
        "lowerbound": 1,
        "value": "", // string
        "sprites": null
      }
    };
    this.solution = {
      "prop_value": "", // string,
      "sprites": null,
      "value": "",
      "isCorrect": function () {
        return this.prop_value === this.value;
      },
      "proposedContainsEnoughDigits": function () {
        return this.prop_value.length === this.value.length;
      }
    };

    this.retryButton = null;
    this.continueButton = null;
  }

  /*
   * A method to update the solved_cb callback function which is called when
   * the MathProblem is solved correctly.
   *
   * Args:
   *   solved_cb (type: function): This function will be called when the
   *     MathProblem has been correctly solved.
   */
  setSolvedCb(solved_cb) {
    this.solved_cb = solved_cb;
  }

  //updateDifficulty(level) {
    //return; // TODO: implement me
  //}

  /*
   * Generates random numbers for both operands, determines solution, updates
   * UI with operands and question marks for solutions digits.
   */
  generateProblem() {
    let ones_x_position = this.math_panel.position.x - 50;
    let top_operand_y_pos = this.math_panel.position.y - 95;
    let bot_operand_y_pos = top_operand_y_pos + 50;
    let solution_y_pos = top_operand_y_pos + 120;
    this._generateOperands();
    this.operands.top.sprites = [];
    this.operands.bot.sprites = [];
    // TODO: leaving these as arrays to support multidigit operands in the future
    this.operands.top.sprites.push(this.game.add.sprite(ones_x_position, top_operand_y_pos,
      this.operands.top.value));
    this.operands.top.sprites[this.operands.top.sprites.length - 1].anchor.setTo(0.5);
    this.operands.bot.sprites.push(this.game.add.sprite(ones_x_position, bot_operand_y_pos,
      this.operands.bot.value));
    this.operands.bot.sprites[this.operands.bot.sprites.length - 1].anchor.setTo(0.5);

    if (this.operation === "addition") {
      this.solution.value = parseInt(this.operands.top.value) + parseInt(this.operands.bot.value);
    } else if (this.operation === "subtraction") {
      this.solution.value = parseInt(this.operands.top.value) - parseInt(this.operands.bot.value);
    }
    this.solution.value = this.solution.value.toString();
    this.solution.sprites = [];
    let digit_x_position = ones_x_position;
    for (let i = 0; i < this.solution.value.length; i++) {
      this.solution.sprites.push(this.game.add.sprite(digit_x_position + 2, solution_y_pos,
        "?"));
      this.solution.sprites[this.solution.sprites.length - 1].anchor.setTo(0.5);
      digit_x_position -= 35;
    }
    this.problemGenerated = true;
  }

  /*
   * Generates random numbers for both operands.
   */
  _generateOperands() {
    this.operands.top.value = Math.floor(
      Math.random() *
      (this.operands.top.upperbound - this.operands.top.lowerbound + 1)
    ) + this.operands.top.lowerbound;
    this.operands.bot.value = Math.floor(
      Math.random() *
      (this.operands.bot.upperbound - this.operands.bot.lowerbound + 1)
    ) + this.operands.bot.lowerbound;
    this.operands.top.value = this.operands.top.value.toString();
    this.operands.bot.value = this.operands.bot.value.toString();
  }

  /*
   * Destroys all UI components of MathProblem, calls solved_cb if it exists,
   * and resumes the game.
   */
  _markProblemSolved() {
    this.math_panel.destroy();
    if (this.operands.top.sprites !== null) {
      for (let i = 0; i < this.operands.top.sprites.length; i++) {
        this.operands.top.sprites[i].destroy();
      }
    }
    if (this.operands.bot.sprites !== null) {
      for (let i = 0; i < this.operands.bot.sprites.length; i++) {
        this.operands.bot.sprites[i].destroy();
      }
    }
    if (this.solution.sprites !== null) {
      for (let i = 0; i < this.solution.sprites.length; i++) {
        this.solution.sprites[i].destroy();
      }
    }
    for(let i = 0; i < this.number_buttons.length; i++) {
      this.number_buttons[i].button.destroy();
    }
    if (this.continueButton !== null) {
      this.continueButton.destroy();
    }
    if (this.retryButton !== null) {
      this.retryButton.destroy();
    }
    if (this.solved_cb !== null) {
      this.solved_cb();
    }
    game.paused = false;
  }

  /*
   * Return the digits in the solution to question marks, destroy the retry
   * prompt and enable the number buttons.
   */
  _resetSolutionAttempt() {
    this.solution.prop_value = "";
    for (let i = 0; i < this.solution.sprites.length; i++) {
      let x_coord = this.solution.sprites[i].position.x;
      let y_coord = this.solution.sprites[i].position.y;
      this.solution.sprites[i].destroy(); // remove the previous sprite (number)
      this.solution.sprites[i] = this.game.add.sprite(x_coord, y_coord, "?");
      this.solution.sprites[i].anchor.setTo(0.5);
    }
    this.retryButton.destroy();
    this._enableNumberButtons();
  }

  /*
   * Disable the number buttons and prompt the user with a 'continue' button
   * below the math panel.
   */
  _promptContinueGameButton() {
    this._disableNumberButtons();
    this.continueButton =
      this.game.add.button(this.math_panel.position.x,
        this.math_panel.position.y + 290, "continue_button",
        this._markProblemSolved, this);
    this.continueButton.anchor.setTo(0.5);
  }

  /*
   * Disable the number buttons and prompt the user with a 'retry' button
   * below the math panel.
   */
  _promptRetryButton() {
    this._disableNumberButtons();
    this.retryButton =
      this.game.add.button(this.math_panel.position.x,
        this.math_panel.position.y + 290, "retry_button",
        this._resetSolutionAttempt, this);
    this.retryButton.anchor.setTo(0.5);
  }

  // Disable the number buttons on the math panel so they are not clickable.
  _disableNumberButtons() {
    for (let i = 0; i < this.number_buttons.length; i++) {
      this.number_buttons[i].button.input.enabled = false;
    }
  }

  // Enable the number buttons on the math panel so they are not clickable.
  _enableNumberButtons() {
    for (let i = 0; i < this.number_buttons.length; i++) {
      this.number_buttons[i].button.input.enabled = true;
    }
  }

  /*
   * Check if the proposed solution is correct, prompting the user with
   * 'continue' or 'retry' depending on the result. If the proposed solution
   * does not yet contain enough digits, then update the solution UI and
   * return.
   *
   * Args:
   *   numberPressed (type: string): the number that was clicked by the user.
   */
  _attemptSolution(numberPressed) {
    if (!this.problemGenerated) {
      return;
    }
    this.solution.prop_value += numberPressed;
    let digit = this.solution.prop_value.length - 1;
    let sprite_idx = this.solution.sprites.length - (digit + 1);
    let x_coord = this.solution.sprites[sprite_idx].position.x;
    let y_coord = this.solution.sprites[sprite_idx].position.y;
    this.solution.sprites[sprite_idx].destroy(); // remove the previous sprite (?)
    this.solution.sprites[sprite_idx] =
      this.game.add.sprite(x_coord, y_coord, this.solution.prop_value[digit]);
    this.solution.sprites[sprite_idx].anchor.setTo(0.5);
    if (!this.solution.proposedContainsEnoughDigits()) {
      return;
    }

    if (this.solution.isCorrect()) {
      this._promptContinueGameButton();
    } else {
      this._promptRetryButton();
    }
 }
}
