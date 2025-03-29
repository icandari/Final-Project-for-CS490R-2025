document.addEventListener('DOMContentLoaded', function() {
    // get week number from URL from the main page 
    const urlParams = new URLSearchParams(window.location.search);
    const weekNum = urlParams.get('week');
    
    if (!weekNum) {
        alert('Week parameter is missing');
        window.location.href = './index.html';
        return;
    }
    
    // update title to current payge
    document.getElementById('week-title').innerText = `Week ${weekNum} Calorie Heatmap`;
    
    // fetch calorie data
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
            
            const label = document.createElement('div');
            label.className = 'heatmap-label';
            label.innerText = meal;
            heatmap.appendChild(label);
            
            // add cells for each day
            weekData.days.forEach((day, dayIndex) => {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                
                let calories = 0;
                const mealKey = meal.toLowerCase();
                if (mealKey === 'breakfast') calories = day.meals.breakfast || 0;
                if (mealKey === 'lunch') calories = day.meals.lunch || 0;
                if (mealKey === 'dinner') calories = day.meals.dinner || 0;
                
                // Set background color based on calorie count
                if (calories === 0) {
                    cell.style.backgroundColor = '#e0e0e0'; // Gray for no calories so (0 or just show blank)
                } else if (calories <= 400) {
                    cell.classList.add('light-blue'); // Light green in CSS (used to be blue)
                } else if (calories <= 600) {
                    cell.classList.add('medium-blue'); // Medium green in CSS
                } else if (calories <= 800) {
                    cell.classList.add('dark-blue'); // Dark green in CSS
                } else {
                    cell.classList.add('navy-blue'); // Very dark green 
                }
                
                // Add calorie value to cell
                const valueSpan = document.createElement('span');
                valueSpan.className = 'calorie-value';
                valueSpan.innerText = calories > 0 ? calories : '-';
                cell.appendChild(valueSpan);
                
                heatmap.appendChild(cell);
            });
        });

        
        setupRangeHighlight();
    }

    //this is the fuynction that will highlight range cells
    function setupRangeHighlight() {
        const highlightButton = document.getElementById('highlight-range');
        const resetButton = document.getElementById('reset-highlight');
        
        highlightButton.addEventListener('click', function() {
            const minCalories = parseInt(document.getElementById('min-calories').value) || 0;
            const maxCalories = parseInt(document.getElementById('max-calories').value) || 3000;
            
            // Remove previous highlights if 
            document.querySelectorAll('.highlighted-cell').forEach(cell => {
                cell.classList.remove('highlighted-cell');
            });
            
            // Aply new highlights
            document.querySelectorAll('.heatmap-cell').forEach(cell => {
                const valueSpan = cell.querySelector('.calorie-value');
                if (!valueSpan) return;
                
                const calorieValue = valueSpan.textContent;
                const calories = parseInt(calorieValue);
                
                if (!isNaN(calories) && calories >= minCalories && calories <= maxCalories) {
                    cell.classList.add('highlighted-cell');
                }
            });
        });
        
        resetButton.addEventListener('click', function() {
            // Clear inputs
            document.getElementById('min-calories').value = '';
            document.getElementById('max-calories').value = '';
            
            // Remove highlights after the hihligh is cliecked
            document.querySelectorAll('.highlighted-cell').forEach(cell => {
                cell.classList.remove('highlighted-cell');
            });
        });
    }
});

//to do: add show all numbers?