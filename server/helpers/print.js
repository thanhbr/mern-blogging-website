import chalk from "chalk";

class OutputType {
  static INFOMATION = "INFOMATION"
  static SUCCESS = "SUCCESS"
  static WARNING = "WARNING"
  static ERROR = "ERROR"
}

function print(message, outputType) {
  switch (outputType) {
    case OutputType.INFOMATION:
      console.log(chalk.white(message));
      break;

    case OutputType.SUCCESS:
      console.log(chalk.green(message));
      break;

    case OutputType.WARNING:
      console.log(chalk.yellow(message));
      break;

    case OutputType.ERROR:
      console.log(chalk.red(message));
      break;

    default:
      console.log(chalk.white(message));
      break;
  }
}

export {
  OutputType,
  print
}