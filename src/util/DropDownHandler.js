import { StatusBar } from "react-native";

export default class DropDownHolder {
  static dropDown;

  static showDropdown(type, title, message){
    this.dropDown.alertWithType(type, title, message);
  }
  static setDropDown(dropDown) {
      this.dropDown = dropDown;
  }
  static getDropDown() {
      return this.dropDown;
  }
}