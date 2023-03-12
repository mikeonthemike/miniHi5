// Define array of response messages
const responses = ["Boom!", "Get Some!", "Alright!", "My hero!", "Nice one!", "Oh Yeah!", "Way to Go!", "Get In!"];

// Define giveHighFive function
function giveHighFive() {
	// Get hand image element
	const hand = document.getElementById("hand");
	// Update image source to show high-five animation
	hand.src = "high-five.gif";
	// Wait for animation to finish
	setTimeout(() => {
		// Select random response message
		const response = responses[Math.floor(Math.random() * responses.length)];
		// Update counter
		const count = document.getElementById("count");
		count.innerText = parseInt(count.innerText) + 1;
		// Show response message
		alert(response);
		// Reset image source to show default hand image
		hand.src = "hand.png";
	}, 1000); // Wait 1 second for animation to finish
}
