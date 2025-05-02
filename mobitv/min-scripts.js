const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const searchY = document.getElementById('searchy');

// Check if dark mode is already applied (based on localStorage or initial state)
if (localStorage.getItem('dark-mode') === 'true') {
  body.classList.add('dark-mode');
  darkModeToggle.checked = true;
}

document.getElementById('hamburger-menu').addEventListener('click', function() {
  const navbarLinks = document.getElementById('navbar-links');
  navbarLinks.classList.toggle('active'); // Toggle the active class to show/hide menu
});

// Event listener for the toggle switch
darkModeToggle.addEventListener('change', function() {
  if (this.checked) {
    // Enable dark mode
    body.classList.add('dark-mode');
    localStorage.setItem('dark-mode', 'true');  // Save preference to localStorage
  } else {
    // Disable dark mode
    body.classList.remove('dark-mode');
    localStorage.setItem('dark-mode', 'false');  // Save preference to localStorage
  }
});

searchY.onclick = () => {
  document.getElementById('searchBar').classList.toggle('expanded');
  document.getElementById('leftNav').classList.toggle('hide');
};

//FOR TABBING Movie & Series
function switchTab(tabId) {
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}
