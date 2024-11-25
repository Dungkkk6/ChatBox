document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatDisplay = document.getElementById("chatDisplay");
  
    const apiKey = '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' ; // Replace with your actual API key
    const model = "gpt-4o"; // Replace with the correct model
  
    let conversationHistory = [
      { role: "system", content: "You are a helpful assistant." }
    ]; // Initialize conversation history
  
    // Function to display messages
    const displayMessage = (sender, message) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", sender);
      messageDiv.innerHTML = `<p><strong>${sender}:</strong> ${message}</p>`;
      chatDisplay.appendChild(messageDiv);
      chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll to bottom
    };
  
    // Function to fetch AI response
    const fetchAIResponse = async (userMessage) => {
      displayMessage("AI", "Loading...");
      
      // Add the user's message to the conversation history
      conversationHistory.push({ role: "user", content: userMessage });
  
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: conversationHistory,
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });
  
        if (!response.ok) throw new Error("Error fetching response from OpenAI API");
  
        const data = await response.json();
        const aiMessage = data.choices[0].message.content.trim();
        
        // Remove the "Loading..." message and display the AI response
        chatDisplay.lastChild.remove();
        displayMessage("AI", aiMessage);
  
        // Add the AI's response to the conversation history
        conversationHistory.push({ role: "assistant", content: aiMessage });
  
      } catch (error) {
        displayMessage("Error", error.message);
      }
    };
  
    // Event listener for send button
    sendBtn.addEventListener("click", () => {
      const userMessage = userInput.value.trim();
      if (userMessage) {
        displayMessage("You", userMessage);
        userInput.value = ""; // Clear input field
        fetchAIResponse(userMessage);
      }
    });
  
    // Allow sending messages with Enter key
    userInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendBtn.click();
      }
    });
  });
  