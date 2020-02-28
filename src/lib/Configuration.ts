import { WorkspaceConfiguration } from "vscode";

import Theme from "./Theme";
import ThemeSettings from "./ThemeSettings";
import VSCodeContext from "./VSCodeContext";

export default class Configuration {
  private static SAVED_COLORS_KEY = "savedColors";
  private static CURRENT_COLORS_KEY = "currentColors";

  private context: VSCodeContext;
  private editorConfig: WorkspaceConfiguration | any;
  private workbenchConfig: WorkspaceConfiguration | any;

  constructor(vscodeContext: VSCodeContext) {
    this.context = vscodeContext;
    this.editorConfig = vscodeContext.getExtensionConfiguration("editor");
    this.workbenchConfig = vscodeContext.getExtensionConfiguration("workbench");
  }

  public getSavedThemeNames(): string[] {
    const savedColors = this.getCurrentColors();
    return Object.keys(savedColors);
  }

  public getCurrentColors(): number[][] {
    return this.context.globalState.get<number[][]>(Configuration.CURRENT_COLORS_KEY) || [];
  }

  public getSavedColors(): any {
    return this.context.globalState.get(Configuration.SAVED_COLORS_KEY) || [];
  }

  public updateConfiguration(colorStrings: number[][]) {
    const theme = new Theme();
    const settings = theme.generateSettingsFromColorStrings(colorStrings);
    this.updateEditorConfig(settings);
    this.updateWorkbenchConfig(settings);
    this.updateCurrentColors(colorStrings);
  }

  public updateCurrentColors(colorStrings: number[][]): void {
    this.context.globalState.update(Configuration.CURRENT_COLORS_KEY, colorStrings);
  }

  public updateSavedColors(colorStrings: number[][]): void {
    this.context.globalState.update(Configuration.SAVED_COLORS_KEY, colorStrings);
  }

  private updateEditorConfig(settings: ThemeSettings): void {
    const newEditorConfig = this.getNewEditorConfig(settings);
    this.editorConfig.update(
      "tokenColorCustomizations",
      newEditorConfig,
      this.context.GlobalConfigurationTarget
    );
  }

  private updateWorkbenchConfig(settings: ThemeSettings): void {
    const newWorkbenchConfig = this.getNewWorkbenchConfig(settings);
    this.workbenchConfig.update(
      "colorCustomizations",
      newWorkbenchConfig,
      this.context.GlobalConfigurationTarget
    );
  }

  private getNewEditorConfig(settings: ThemeSettings) {
    return Object.assign({}, this.editorConfig.get("tokenColorCustomizations"), {
      "[ColorCode]": settings.tokenColorCustomizations
    });
  }

  private getNewWorkbenchConfig(settings: ThemeSettings) {
    return Object.assign({}, this.workbenchConfig.get("tokenColorCustomizations"), {
      "[ColorCode]": settings.colorCustomizations
    });
  }
}
