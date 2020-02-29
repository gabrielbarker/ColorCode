import Configuration from "../Configuration";
import Command from "./Command";
import VSCodeContext from "../VSCodeContext";

export default class SaveCommand implements Command {
  private context: VSCodeContext;
  private configuration: Configuration;

  public static getInstance(context: VSCodeContext): SaveCommand {
    return new SaveCommand(context);
  }

  private constructor(context: VSCodeContext) {
    this.context = context;
    this.configuration = context.getConfiguration();
  }

  public execute(): void {
    this.context
      .showInputBox({ placeHolder: "Enter a name for your theme..." })
      .then(this.saveColorsIfNameIsValid);
  }

  private saveColorsIfNameIsValid(value: any) {
    const currentNames = this.configuration.getSavedThemeNames();
    if (currentNames.length) {
      this.saveCurrentColors(value);
      this.context.showInformationMessage(`Theme '${value}' successfully saved`);
    }
  }

  private saveCurrentColors(name: string): void {
    const currentColors = this.configuration.getCurrentColors();
    this.saveColors(currentColors, name);
  }

  private saveColors(colorStrings: number[][], name: string): void {
    let savedColors = this.configuration.getSavedColors();
    savedColors[name] = colorStrings;
    this.configuration.updateSavedColors(savedColors);
  }
}
