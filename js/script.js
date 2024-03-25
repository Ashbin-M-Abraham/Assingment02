class Smoothie {
    constructor() {
        this.size = null;
        this.base = null;
        this.addIns = [];
        this.finishingTouches = [];
        this.prices = {}; // This will hold the fetched prices data
    }

    updatePrices(prices) {
        this.prices = prices;
    }

    updateSelections(selections) {
        this.size = selections.size;
        this.base = selections.base;
        this.addIns = selections.addIns;
        this.finishingTouches = selections.finishingTouches;
    }

    calculatePrice() {
        let totalPrice = 0;
        if (this.size) totalPrice += this.prices.size[this.size];
        if (this.base) totalPrice += this.prices.bases[this.base];
        this.addIns.forEach(addIn => totalPrice += this.prices.addIns[addIn]);
        this.finishingTouches.forEach(touch => totalPrice += this.prices.finishingTouches[touch]);
        return totalPrice;
    }

    generateSummary() {
        let summaryHtml = '<h4>Selected Items:</h4>';
        let imageHtml = '';

        if (this.base) {
            const basePrice = this.prices.bases[this.base];
            summaryHtml += `<p>Base: ${this.base} - $${basePrice}</p>`;
            if (this.prices.img && this.prices.img[this.base]) {
                imageHtml = `<img src="${this.prices.img[this.base]}" alt="${this.base}" style="max-width:100%; height:auto;">`;
            }
        }

        // Add-Ins
        this.addIns.forEach(addIn => {
            const addInPrice = this.prices.addIns[addIn];
            summaryHtml += `<p>Add-In: ${addIn} - $${addInPrice}</p>`;
        });

        // Finishing Touches
        this.finishingTouches.forEach(touch => {
            const touchPrice = this.prices.finishingTouches[touch];
            summaryHtml += `<p>Finishing Touch: ${touch} - $${touchPrice}</p>`;
        });

        let totalPrice = this.calculatePrice();
        document.getElementById('orderSummary').innerHTML = summaryHtml;
        document.getElementById('totalPrice').textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        document.getElementById('images').innerHTML = imageHtml;
    }
}

// Instantiate the Smoothie object
let mySmoothie = new Smoothie();

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://ashbin-m-abraham.github.io/Assingment02/js/ingredients.json')
        .then(response => response.json())
        .then(data => {
            mySmoothie.updatePrices(data);
            mySmoothie.generateSummary(); // Initial summary
        })
        .catch(error => console.error('Error fetching the JSON file:', error));

    // Event listeners for the form
    document.querySelectorAll('input[name="size"], #base, input[name="addIns"], input[name="finishingTouches"]').forEach(input => {
        input.addEventListener('change', updateSelectionsAndSummary);
    });

    document.getElementById('smoothieForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitOrder();
    });
});

function updateSelectionsAndSummary() {
    let selections = {
        size: document.querySelector('input[name="size"]:checked')?.value,
        base: document.getElementById('base').value,
        addIns: Array.from(document.querySelectorAll('input[name="addIns"]:checked')).map(e => e.value),
        finishingTouches: Array.from(document.querySelectorAll('input[name="finishingTouches"]:checked')).map(e => e.value),
    };
    mySmoothie.updateSelections(selections);
    mySmoothie.generateSummary();
}

function submitOrder() {
    alert('Thank you for your order!');
    document.getElementById('smoothieForm').reset();
    nextStep(1); // Go back to the first step
    // Clear selections and regenerate the summary
    mySmoothie.updateSelections({ size: null, base: null, addIns: [], finishingTouches: [] });
    mySmoothie.generateSummary();
}

function nextStep(step) {
    document.getElementById(`step${currentStep}`).style.display = 'none';
    document.getElementById(`step${step}`).style.display = 'block';
    currentStep = step;
}

let currentStep = 1; // Initial step
