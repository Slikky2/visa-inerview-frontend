export function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

export function startListening() {
  // Your logic to start recognition
}

export function stopListening() {
  // Your logic to stop recognition
}

export function sendMessage(message) {
  // Your logic to send message to OpenAI, etc.
}
