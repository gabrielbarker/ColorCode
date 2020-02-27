import * as vscode from "vscode";
import ExtensionContext from "../ExtensionContext";
import Configuration from "../Configuration";
import InputValidator from "../InputValidator";
import Command from "./Command";

export default class LoadCommand implements Command {
  private context: ExtensionContext;
  private configuration: Configuration;
  private validator: InputValidator;

  public static getInstance(context: ExtensionContext): LoadCommand {
    return new LoadCommand(context);
  }

  private constructor(context: ExtensionContext) {
    this.context = context;
    this.configuration = new Configuration(context);
    this.validator = new InputValidator();
  }

  public execute(): void {
    const themeNames = this.configuration.getSavedThemeNames();
    this.validator.validateSavedThemes(themeNames);
    if (this.validator.isValid()) {
      this.pickTheme(themeNames);
    }
  }

  private pickTheme(themeNames: string[]) {
    vscode.window.showQuickPick(themeNames).then(this.setTheme);
  }

  private setTheme(themeName: any): void {
    if (themeName) {
      const colorStrings = this.getColorsByName(themeName);
      this.configuration.updateConfiguration(colorStrings);
    }
  }

  private getColorsByName(name: string): number[][] {
    const colors = this.context.getSavedColors();
    vscode.window.showInformationMessage(`Theme '${name}' successfully loaded`);
    return colors[name];
  }

  public static getTestingInstance(
    context: ExtensionContext,
    configuration: Configuration,
    validator: InputValidator
  ): LoadCommand {
    const loadCommand = new LoadCommand(context);
    loadCommand.context = context;
    loadCommand.configuration = configuration;
    loadCommand.validator = validator;
    return loadCommand;
  }
}
