
console.log('Test script loaded successfully!');

document.addEventListener('DOMContentLoaded', () => {
  const testElement = document.getElementById('js-test');
  if (testElement) {
    testElement.textContent = 'JavaScript is working correctly!';
  }
});
