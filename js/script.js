document.addEventListener('DOMContentLoaded', function() {

    let calorieData;
    let currentWeek = 0; // 0-indexed (Week 1)

    // Fetch the JSON data when the page loads
    fetch('./data/monthdata.json')
        .then(response => response.json())
        .then(data => {
            calorieData = data;
            console.log('Data loaded successfully');
            // Now that data is loaded, calculate and display weekly totals
            displayWeekTotals();
            setupWeekNavigation();
        })
        .catch(error => {
            console.error('Error loading calorie data:', error);
        });

    // Function to display weekly totals in the HTML
    function displayWeekTotals() {
        if (!calorieData) {
            console.error('Data not loaded yet');
            return;
        }
        
        const weekTotalArray = getWeekTotals(calorieData);
        
        // Update the HTML with calculated totals
        document.getElementById('week1-total-calories').innerHTML = weekTotalArray[0] + ' calories';
        document.getElementById('week2-total-calories').innerHTML = weekTotalArray[1] + ' calories';
        document.getElementById('week3-total-calories').innerHTML = weekTotalArray[2] + ' calories';
        document.getElementById('week4-total-calories').innerHTML = weekTotalArray[3] + ' calories';
    }

    function getWeekTotals(calorieData){
        const weekTotalArray = [0,0,0,0];


        //MONTH LEVEL - access each object within the "weeks" array and assign it to its own weekObject
        //weekObject: gets assigned each array item (weeks[0], weeks[1], etc.)
        //index: gets assigned the position (0, 1, 2, 3)
        calorieData.weeks.forEach((weekObject,index) => { 

            //WEEK LEVEL - access each object within the "days" array and assign it to its own dayObject
            //create a variable to hold the total for each week
            let singleWeekTotal = 0;

            //for each week, loop through the days
            weekObject.days.forEach(dayObject => {

                //DAY LEVEL - access each object within the "meals" object and assign it to its own meals variable
                const meals = dayObject.meals;
                const singleDayTotal = (meals.breakfast || 0)  + (meals.lunch || 0) + (meals.dinner || 0)
                //add the singleDayTotal to the singleWeekTotal
                singleWeekTotal += singleDayTotal;
            })
            
            //takes the index, which corresponds to the week number, and assigns the singleWeekTotal to the weekTotalArray
            weekTotalArray[index] = singleWeekTotal;
           
        });

        return weekTotalArray;
    }

    // Setup navigation arrows
    function setupWeekNavigation() {
        const prevButton = document.getElementById('prev-week');
        const nextButton = document.getElementById('next-week');
        const weekSlider = document.getElementById('week-slider');
        
        // Initially show first week
        updateSliderPosition();
        
        // Arrow click handlers
        prevButton.addEventListener('click', function() {
            if (currentWeek > 0) {
                currentWeek--;
                updateSliderPosition();
            }
        });
        
        nextButton.addEventListener('click', function() {
            if (currentWeek < 3) {
                currentWeek++;
                updateSliderPosition();
            }
        });
        
        // Add click handler to navigate to week details
        document.querySelectorAll('.week-slide').forEach(slide => {
            slide.addEventListener('click', function() {
                const weekNum = this.getAttribute('data-week');
                window.location.href = `./weekdetails.html?week=${weekNum}`;
            });
        });
        
        function updateSliderPosition() {
            // Update slider position
            weekSlider.style.transform = `translateX(-${currentWeek * 100}%)`;
            
            // Update button states
            prevButton.disabled = currentWeek === 0;
            nextButton.disabled = currentWeek === 3;
            
            // Apply visual indication for disabled buttons
            prevButton.style.opacity = currentWeek === 0 ? 0.5 : 1;
            nextButton.style.opacity = currentWeek === 3 ? 0.5 : 1;
        }
    }
});