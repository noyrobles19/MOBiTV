const searchenter = document.getElementById('searchSubmit');
const searchInput = document.getElementById('searchInput');

function handleSearch() {
    const searching = document.getElementById('searchInput').value.trim();
    
    if (searching !== "") {
        document.cookie = `searchQuery=${encodeURIComponent(searching)}; path=/; SameSite=Lax`;
        window.location.href = "search.html";
    }
};

searchenter.onclick = handleSearch; // Click event

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch(); // Trigger function on Enter key press
    }
});

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        let [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}