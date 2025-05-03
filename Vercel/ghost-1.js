document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

document.addEventListener('keydown', function(event) {
  if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
      event.preventDefault();
  }
});
setInterval(() => {
    const threshold = 160; // Adjust threshold based on browser behavior

    // Detect devtools opening by checking the difference in dimensions
    if (window.outerWidth - window.innerWidth > threshold || 
        window.outerHeight - window.innerHeight > threshold) {
        window.blur(); // Push focus away
        window.location = "https://pornhub.com"; 
    }
}, 50);

(function detectDevTools() {
    const start = performance.now();
    debugger;
    const end = performance.now();
    
    if (end - start > 100) { // If time gap is large, debugger is active
        window.blur(); // Push focus away
        window.location = "https://pornhub.com";  // Redirect user
    }
    
    setTimeout(detectDevTools, 100); // Check every 500ms
})();