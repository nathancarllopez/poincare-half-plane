export default class ToolbarConfig extends Object {
  private checkboxes: { [key: string]: boolean } = {
    cursorCoordToggle: true,
  };
  private radioButtons: { [key: string]: string } = {
    clickTool: 'drawPoints',
  };

  constructor(toolbar?: Element) {
    super();
    if (!toolbar) return;

    const checkboxes = toolbar.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      const checkboxElement = checkbox as HTMLInputElement;
      this.checkboxes[checkboxElement.id] = checkboxElement.checked;
    });

    const radioButtons = toolbar.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radioButton => {
      const radioButtonElement = radioButton as HTMLInputElement;
      if (radioButtonElement.checked) {
        this.radioButtons[radioButtonElement.name] = radioButtonElement.id;
      }
    });
  }

  getToolbarValue(key: string) {
    for (const field in this) {
      const fieldValues = this[field] as { [key: string]: any };
      if (key in fieldValues) {
        return fieldValues[key];
      }
    }
  }
}