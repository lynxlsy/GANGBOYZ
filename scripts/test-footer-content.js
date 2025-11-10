// Script to test footer content in localStorage
if (typeof localStorage !== 'undefined') {
  const contents = localStorage.getItem('gang-boyz-editable-contents');
  if (contents) {
    const parsed = JSON.parse(contents);
    const footerContent = parsed.find(c => c.id === 'footer-description');
    console.log('Footer content in localStorage:', footerContent);
  } else {
    console.log('No editable contents found in localStorage');
  }
} else {
  console.log('localStorage not available');
}