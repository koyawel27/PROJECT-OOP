// userActivities.js - Manages user-specific activities

// Sample activities for each default user
const defaultActivities = {
    "juan": {
        "midterm": [
            { name: "Pop-up Project", url: "juan/midterm/popup.html", completed: true },
            { name: "Register Form", url: "juan/midterm/register.html", completed: true },
            { name: "IF Statement Exercise", url: "juan/midterm/if.html", completed: false }
        ],
        "finals": [
            { name: "Activity 1 - Arrays", url: "juan/finals/activity1.html", completed: true },
            { name: "Activity 2 - Objects", url: "juan/finals/activity2.html", completed: false },
            { name: "Activity 3 - DOM Manipulation", url: "juan/finals/activity3.html", completed: false },
            { name: "Activity 4 - Product Cart", url: "juan/finals/activity4.html", completed: true },
            { name: "Activity 5 - Product Total", url: "juan/finals/activity5.html", completed: true }
        ]
    },
    "maria": {
        "midterm": [
            { name: "Pop-up Project", url: "maria/midterm/popup.html", completed: true },
            { name: "Register Form", url: "maria/midterm/register.html", completed: false },
            { name: "IF Statement Exercise", url: "maria/midterm/if.html", completed: true }
        ],
        "finals": [
            { name: "Activity 1 - DOM Events", url: "maria/finals/activity1.html", completed: true },
            { name: "Activity 2 - Local Storage", url: "maria/finals/activity2.html", completed: true },
            { name: "Activity 3 - Form Validation", url: "maria/finals/activity3.html", completed: false },
            { name: "Activity 4 - Product Cart", url: "maria/finals/activity4.html", completed: false },
            { name: "Activity 5 - Product Total", url: "maria/finals/activity5.html", completed: false }
        ]
    },
    "carlo": {
        "midterm": [
            { name: "Pop-up Project", url: "carlo/midterm/popup.html", completed: false },
            { name: "Register Form", url: "carlo/midterm/register.html", completed: true },
            { name: "IF Statement Exercise", url: "carlo/midterm/if.html", completed: true }
        ],
        "finals": [
            { name: "Activity 1 - JSON", url: "carlo/finals/activity1.html", completed: true },
            { name: "Activity 2 - Functions", url: "carlo/finals/activity2.html", completed: true },
            { name: "Activity 3 - CSS Manipulation", url: "carlo/finals/activity3.html", completed: true },
            { name: "Activity 4 - Product Cart", url: "carlo/finals/activity4.html", completed: true },
            { name: "Activity 5 - Product Total", url: "carlo/finals/activity5.html", completed: false }
        ]
    }
};

// Initialize activities in localStorage if they don't exist
function initializeActivities() {
    if (!localStorage.getItem('userActivities')) {
        localStorage.setItem('userActivities', JSON.stringify(defaultActivities));
    }
}

// Get activities for a specific user
function getUserActivities(username) {
    const allActivities = JSON.parse(localStorage.getItem('userActivities'));
    return allActivities[username] || { midterm: [], finals: [] };
}

// Add new activity for a user
function addActivity(username, category, activityName, activityUrl) {
    const allActivities = JSON.parse(localStorage.getItem('userActivities'));
    
    // If user doesn't have activities yet, create an empty structure
    if (!allActivities[username]) {
        allActivities[username] = { midterm: [], finals: [] };
    }
    
    // Add the new activity to the appropriate category
    allActivities[username][category].push({
        name: activityName,
        url: activityUrl,
        completed: false
    });
    
    // Save back to localStorage
    localStorage.setItem('userActivities', JSON.stringify(allActivities));
}

// Update activity completion status
function updateActivityStatus(username, category, activityIndex, completed) {
    const allActivities = JSON.parse(localStorage.getItem('userActivities'));
    
    if (allActivities[username] && allActivities[username][category] && 
        allActivities[username][category][activityIndex] !== undefined) {
        allActivities[username][category][activityIndex].completed = completed;
        localStorage.setItem('userActivities', JSON.stringify(allActivities));
        return true;
    }
    return false;
}

// Initialize activities on script load
initializeActivities();