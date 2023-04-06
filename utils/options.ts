// Because many radio/toggle options using same value but different case
// This utility used to generate "name" from given Array of value
// adding capitalize to it

interface ReturnOptions {
  name: string;
  value: string;
}

export function createRadioOptions(options: string[]) {
  return options.map(value => ({
    value,
    name: value.charAt(0).toUpperCase() + value.slice(1)
  }))
}