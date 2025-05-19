

(function() {
    // Function to check if user is logged in
    function checkAuthentication() {
        try {
            // Get logged in user data from localStorage
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            
            // If no logged in user found, redirect to login page
            if (!loggedInUser) {
                // Show message to user
                alert("Please login first to access this page");
                
                // Redirect to landing page
                window.location.href = "landing-page.html";
                return false;
            }
            
            
            // For example, if you stored a timestamp or token expiration
            if (loggedInUser.expiresAt && new Date(loggedInUser.expiresAt) < new Date()) {
                alert("Your session has expired. Please login again.");
                
                // Clear the expired session
                localStorage.removeItem("loggedInUser");
                
                // Redirect to login page
                window.location.href = "landing-page.html";
                return false;
            }
            
            return true;
        } catch (error) {
            console.error("Authentication check failed:", error);
            
            // If there's any error, it's safer to redirect to login
            alert("Authentication error. Please login again.");
            window.location.href = "landing-page.html";
            return false;
        }
    }
    
    // Run authentication check immediately when script loads
    checkAuthentication();
})();