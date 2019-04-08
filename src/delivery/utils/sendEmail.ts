interface IOptions {
  [key: string]: any;
}

export const setProperty = (options: IOptions = {}): void => {
  const doorbell = (window as any).doorbell;
  if (doorbell !== undefined) {
    for (const field of Object.keys(options)) doorbell.setProperty(field, JSON.stringify(options[field]));
  }
};

export const sendEmail = (address: string, options: IOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const doorbell = (window as any).doorbell;
    if (doorbell !== undefined) {
      setProperty(options);
      doorbell.setOption("email", address);
      doorbell.send("<Inform me of new levels>", address, () => resolve(), (error: any) => {
        reject(error || "Are you sure that you are online?")
      });
    } else {
      reject("Are you sure that you are online?");
    }
  });
};
