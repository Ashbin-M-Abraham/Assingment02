let currentStep = 1;

function nextStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    // Show next step
    document.getElementById(`step${step}`).style.display = 'block';
    currentStep = step;
}

document.getElementById('smoothieForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    // Submit the order
    submitOrder();
});

function submitOrder() {
    // This is where you'd handle the order processing
    alert('Thank you for your order!');
    
    // Reset the form and go back to the first step if needed
    document.getElementById('smoothieForm').reset();
    nextStep(1);
}

// Initially display only the first step
nextStep(1);
const selections = {
    size: { selected: null, price: 0 },
    base: { selected: null, price: 0 },
    addIns: [],
    finishingTouches: []
};
const prices = {
    size: { small: 3, medium: 5, large: 7 },
    base: { banana: 1, strawberry: 1.5, spinach: 1, kale: 1.5, mango: 2 },
    addIns: { 'Greek Yogurt': 1, 'Protein Powder': 2, 'Nut Butter': 1.5, 'Chia Seeds': 1, 'Honey': 0.5 },
    finishingTouches: { 'Granola': 1, 'Coconut Flakes': 1, 'Cinnamon': 0.5, 'Mint Leaves': 0.5 }
};

// Fetch the JSON file
fetch('./ingredients.json')
  .then(response => response.json())
  .then(data => {
    // Update the selections object with the fetched data
    selections.size.selected = data.smoothie.size;
    selections.base.selected = data.smoothie.base;
    selections.addIns = data.smoothie.addIns;
    selections.finishingTouches = data.smoothie.finishingTouches;

    updateSummary();
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
  });
  function updateSummary() {
    let summaryHtml = '';
    let totalPrice = 0;

    // Size
    if (selections.size.selected) {
        summaryHtml += `<p>Size: ${selections.size.selected}</p>`;
    }

    // Base
    if (selections.base.selected) {
        summaryHtml += `<p>Base: ${selections.base.selected}</p>`;
    }

    // Add-ins
    if (selections.addIns.length > 0) {
        summaryHtml += '<p>Add-ins:</p>';
        selections.addIns.forEach(addIn => {
            const addInSelection = data.addIns.find(item => item.id === addIn);
            if (addInSelection) {
                summaryHtml += `<p>- ${addInSelection.name}</p>`;
                totalPrice += parseFloat(addInSelection.price);
            }
        });
    }

    // Finishing Touches
    if (selections.finishingTouches.length > 0) {
        summaryHtml += '<p>Finishing Touches:</p>';
        selections.finishingTouches.forEach(finishingTouch => {
            const finishingTouchSelection = data.finishingTouches.find(item => item.id === finishingTouch);
            if (finishingTouchSelection) {
                summaryHtml += `<p>- ${finishingTouchSelection.name}</p>`;
                totalPrice += parseFloat(finishingTouchSelection.price);
            }
        });
    }

    // Display total price
    if (totalPrice > 0) {
        summaryHtml += `<p>Total: $${totalPrice.toFixed(2)}</p>`;
    }

    // Display the summary
    document.getElementById('summary').innerHTML = summaryHtml;
}