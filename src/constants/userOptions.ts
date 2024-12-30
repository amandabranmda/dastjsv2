export let USER_OPTIONS = [
  "Simone",
  "Kaique",
  "Thais",
  "Maikon",
  "Duda",
  "João",
  "Richard",
  "Suelem"
] as const;

export const addNewUser = (newUser: string) => {
  // Convert USER_OPTIONS to a regular array
  const mutableOptions = [...USER_OPTIONS] as string[];
  
  // Add the new user if it doesn't exist
  if (!mutableOptions.includes(newUser)) {
    mutableOptions.push(newUser);
    // Update USER_OPTIONS
    USER_OPTIONS = mutableOptions as unknown as typeof USER_OPTIONS;
  }
};