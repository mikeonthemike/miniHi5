// Get the Discord webhook URL
const webhookUrl = "https://discord.com/api/webhooks/1097998673494949898/WVVQ_SDx0_ItQ7t4NYhA84kTeYMVT6qod6jDHLkUkTKzDg68P9Lble46a9L3dpIoJOJi";

// Function to send a message to the Discord webhook
function sendDiscordMessage(message) {
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: `Someone just gave themselves a high five! They have given themselves ${counter} high fives so far. ${response}`
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to send message to Discord.");
    }
  })
  .catch(error => {
    console.error(error);
  });
}


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
		hand.src = "palm2x.png";
	}, 1000); // Wait 1 second for animation to finish
	
	  // Send a message to the Discord webhook
  const message = `Someone just gave themselves a high five! They have given themselves ${counter} high fives so far. ${response}`;
  sendDiscordMessage(message);
}
