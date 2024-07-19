let currentStep = 0; // Declare once

const steps = document.querySelectorAll('.form-main-wrap');
const stepIndicatorCircles = document.querySelectorAll('.step-indicator-circle');

function showStep(step) {
	steps.forEach((stepElement, index) => {
		stepElement.classList.toggle('active', index === step);
	});

	stepIndicatorCircles.forEach((circle, index) => {
		circle.classList.toggle('active', index <= step);
	});

	document.getElementById('current-step').textContent = step + 1;

	// Handle visibility of buttons based on the current step
	if (step === 0) {
		document.getElementById('prevBtn').style.display = 'none';
	} else {
		document.getElementById('prevBtn').style.display = 'inline';
	}

	if (step === steps.length - 1) {
		document.getElementById('nextBtn').style.display = 'none';
		document.querySelector('.c-form-submit').style.display = 'block';
	} else {
		document.getElementById('nextBtn').style.display = 'inline';
		document.querySelector('.c-form-submit').style.display = 'none';
	}
}

function nextPrev(stepChange) {
	const form = document.getElementById('multiStepForm');
	
	// Validate only the current step
	if (stepChange === 1 && !form.checkValidity()) {
		form.reportValidity();
		return;
	}

	// Update the current step
	currentStep += stepChange;
	
	// Ensure the step is within valid bounds
	if (currentStep < 0) currentStep = 0;
	if (currentStep >= steps.length) currentStep = steps.length - 1;

	showStep(currentStep);
}

// Initialize the form to show the first step
showStep(currentStep);

// Event listeners for buttons (assuming you have these buttons in your HTML)
document.getElementById('prevBtn').addEventListener('click', () => nextPrev(-1));
document.getElementById('nextBtn').addEventListener('click', () => nextPrev(1));

// Catering-Step-Form-code END