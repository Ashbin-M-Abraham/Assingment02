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
let prices = {};  // This will hold the fetched prices data

document.addEventListener('DOMContentLoaded', function() {
    // Initially display only the first step
    nextStep(1);

    // Fetch the JSON file
    fetch('https://ashbin-m-abraham.github.io/Assingment02/js/ingredients.json')
        .then(response => response.json())
        .then(data => {
            prices = data;
            console.log("Prices loaded:", prices);
            // Initialize summary to reflect initial state
            updateSummary();
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });

    // Event listeners for size and base
    document.querySelectorAll('input[name="size"], #base').forEach(input => {
        input.addEventListener('change', updateSelectionsAndSummary);
    });

    // Event listeners for addIns and finishingTouches
    document.querySelectorAll('input[name="addIns"], input[name="finishingTouches"]').forEach(input => {
        input.addEventListener('change', updateSelectionsAndSummary);
    });

    document.getElementById('smoothieForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        submitOrder();
    });
});

function updateSelectionsAndSummary() {
    // Update selections based on user input
    // Size
    selections.size = document.querySelector('input[name="size"]:checked')?.value;
    // Base
    selections.base = document.getElementById('base').value;
    // Add-Ins
    selections.addIns = Array.from(document.querySelectorAll('input[name="addIns"]:checked')).map(e => e.value);
    // Finishing Touches
    selections.finishingTouches = Array.from(document.querySelectorAll('input[name="finishingTouches"]:checked')).map(e => e.value);

    updateSummary();
}

function nextStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    // Show next step
    document.getElementById(`step${step}`).style.display = 'block';
    currentStep = step;
}

function submitOrder() {
    alert('Thank you for your order!');
    document.getElementById('smoothieForm').reset();
    nextStep(1);
    // Clear selections and update summary
    selections = { size: null, base: null, addIns: [], finishingTouches: [] };
    updateSummary();
}

let selections = {
    size: null, // 'small', 'medium', 'large'
    base: null, // 'banana', 'strawberry', etc.
    addIns: [], // ['Greek Yogurt', 'Protein Powder', ...]
    finishingTouches: [] // ['Granola', 'Coconut Flakes', ...]
};

function updateSummary() {
    let summaryHtml = '<h4>Selected Items:</h4>';
    let totalPrice = 0;
    let imageHtml = '';

    // Size
    if (selections.size) {
        const sizePrice = prices.size[selections.size];
        summaryHtml += `<p>Size: ${selections.size} - $${sizePrice}</p>`;//learned this from"https://www.w3docs.com/snippets/javascript.html" rather than using document.createElement
        totalPrice += sizePrice;
    }

    // Base
    if (selections.base) {
        const basePrice = prices.bases[selections.base];
        summaryHtml += `<p>Base: ${selections.base} - $${basePrice}</p>`;
        totalPrice += basePrice;
    }
    //images
    if (selections.base && prices.img && prices.img[selections.base]) {
        imageHtml = `<img src="${prices.img[selections.base]}" alt="${selections.base}" style="width:100%; height:auto;">`;
    } else {
        imageHtml = `<p>No base selected.</p>`; // Placeholder text or you can leave it empty
    }

    // Add-Ins
    selections.addIns.forEach(addIn => {
        const addInPrice = prices.addIns[addIn];
        summaryHtml += `<p>Add-In: ${addIn} - $${addInPrice}</p>`;
        totalPrice += addInPrice;
    });

    // Finishing Touches
    selections.finishingTouches.forEach(touch => {
        const touchPrice = prices.finishingTouches[touch];
        summaryHtml += `<p>Finishing Touch: ${touch} - $${touchPrice}</p>`;
        totalPrice += touchPrice;
    });
    // Update DOM elements for order summary and total price
    document.getElementById('orderSummary').innerHTML = summaryHtml;
    document.getElementById('totalPrice').textContent = `Total: $${totalPrice.toFixed(2)}`;
  
    document.getElementById('images').innerHTML = imageHtml;
}
