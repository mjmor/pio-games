/*
 * TODO: write docs
 *
 *
 */
class MathProblem {
  constructor(game, problem_type, solved_cb = null) {
    game.paused = true;
    this.problem_type = problem_type;
    this.problemGenerated = false;
    this.solved_cb = solved_cb;

    if (this.problem_type === "addition") {
      this.math_panel = game.add.sprite(175, 50, 'addition_panel');
    } else if (this.problem_type === "addition") {
      this.math_panel = game.add.sprite(175, 50, 'subtraction_panel');
    }

    this.number_buttons = [{"text": "0", "button": null},
      {"text": "1", "button": null},
      {"text": "2", "button": null},
      {"text": "3", "button": null},
      {"text": "4", "button": null},
      {"text": "5", "button": null},
      {"text": "6", "button": null},
      {"text": "7", "button": null},
      {"text": "8", "button": null},
      {"text": "9", "button": null}];

    // Add solution buttons to the panel
    let x_position = 275;
    let y_top_position = 413;
    let y_bot_position = 467;
    let y_position = y_top_position;
    let separation = 50;
    for (let num = 0; num < 10; num++) {
      if (num === 5) { // switch to lower row
        y_position = y_bot_position;
        x_position = 275;
      }
      this.number_buttons[num].button =
        game.add.button(x_position, y_position, num.toString(),
          this._attemptSolution, this); // TODO: bind _attemptSolution to
      // different arguments so we know the button pressed
      x_position += separation;
    }


    this.operands = {
      "top": {
        "upperbound": 9,
        "lowerbound": 5,
        "value": null, // string
        "sprites": null
      },
      "bot": {
        "upperbound": 5,
        "lowerbound": 1,
        "value": null, // string
        "sprites": null
      }
    };
    this.solution = {
      "prop_value": null, // string,
      "sprites": null,
      "value": null
    };
  }

  // Must be invoked before the first problem is generated or else error is
  // thrown.
  setSolvedCb(solved_cb) {
    this.solved_cb = solved_cb;
  }

  updateDifficulty(level) {
    return; // TODO: implement me
  }

  // separate out problem construction into another function so that
  // the caller can set the difficulty level first like so:
  // let mathProblem = new MathProblem(game, 'addition');
  // if (score > 45) {
  //   mathProblem.updateDifficulty(3);
  // }
  // mathProblem.generateProblem();
  generateProblem() {
    this._generateOperands();
    this.operands.top.sprites = [];
    this.operands.bot.sprites = [];
    // TODO: leaving these as arrays to support multidigit operands in the future
    this.operands.top.sprites.push(game.add.sprite(325, 200,
      this.operands.top.value));
    this.operands.bot.sprites.push(game.add.sprite(325, 250,
      this.operands.bot.value));

    // TODO: set the solution array to the right size with null value and
    // questions marks in the UI
    this.problemGenerated = true;
    return;
  }

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
    return;
  }

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
    // TODO: destroy buttons as well
  }

  _attemptSolution(numberPressed) {
    if (!this.problemGenerated) {
      return;
    }

    // TODO: implement me, add the number pressed to the
    // solution value and check if it is correct and act appropriately
    if (true) {
      this._markProblemSolved();
      this.solved_cb();
    } else {

    }
    return;
 }
}
