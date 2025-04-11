// eslint-disable-next-line no-undef
jest.spyOn(console, 'warn').mockImplementation((msg) => {
  if (msg.includes('Support for defaultProps will be removed')) return;
  console.warn(msg);
});
