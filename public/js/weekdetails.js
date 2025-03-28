document.addEventListener('DOMContentLoaded', function() {
    // Get week number from URL
    const urlParams = new URLSearchParams(window.location.search);
    const weekNum = urlParams.get('week');
    
    if (!weekNum) {
        alert('Week parameter is missing');
        window.location.href = './index.html';
        return;
    }
    
    // Update title
    document.getElementById('week-title').innerText = `Week ${weekNum} Calorie Heatmap`;
    
    // Fetch calorie data
    fetch('./data/monthdata.json')
        .then(response => response.json())
        .then(data => {
            const weekIndex = parseInt(weekNum) - 1;
            const weekData = data.weeks[weekIndex];
            createHeatmap(weekData);
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
        
    // Function to create the heatmap
    function createHeatmap(weekData) {
        const heatmap = document.getElementById('heatmap');
        heatmap.innerHTML = ''; // Clear existing content
        
        // Add blank cell in top-left
        const blankCell = document.createElement('div');
        blankCell.className = 'heatmap-header';
        heatmap.appendChild(blankCell);
        
        // Add day headers
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        days.forEach((day, index) => {
            const header = document.createElement('div');
            header.className = 'heatmap-header';
            header.innerText = day;
            heatmap.appendChild(header);
        });
        
        // Add rows for meals
        const meals = ['Breakfast', 'Lunch', 'Dinner'];
        meals.forEach((meal, mealIndex) => {
            // Add row label
            const label = document.createElement('div');
            label.className = 'heatmap-label';
            label.innerText = meal;
            heatmap.appendChild(label);
            
            // Add cells for each day
            weekData.days.forEach((day, dayIndex) => {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                
                let calories = 0;
                const mealKey = meal.toLowerCase();
                if (mealKey === 'breakfast') calories = day.meals.breakfast || 0;
                if (mealKey === 'lunch') calories = day.meals.lunch || 0;
                if (mealKey === 'dinner') calories = day.meals.dinner || 0;
                
                // Set background color based on calorie count
                let colorClass = '';
                if (calories === 0) {
                    cell.style.backgroundColor = '#f0f0f0'; // Light gray for no calories
                } else if (calories <= 400) {
                    cell.classList.add('light-blue');
                } else if (calories <= 600) {
                    cell.classList.add('medium-blue');
                } else if (calories <= 800) {
                    cell.classList.add('dark-blue');
                } else {
                    cell.classList.add('navy-blue');
                }
                
                // Add calorie value to cell
                const valueSpan = document.createElement('span');
                valueSpan.className = 'calorie-value';
                valueSpan.innerText = calories > 0 ? calories : '-';
                cell.appendChild(valueSpan);
                
                heatmap.appendChild(cell);
            });
        });
    }
});