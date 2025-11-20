// a tiny test that succeeds if the app module loads
try {
  import('./index.js');
  console.log("OK");
  process.exit(0);
} catch (e) {
  console.error("FAIL", e);
  process.exit(1);
}
