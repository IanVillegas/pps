const isNullUndefinedOrBlank = (value: string | undefined) => {
  return value === null || value === undefined || value === '';
};
export default isNullUndefinedOrBlank;
