Notification.requestPermission().then((result) => {
    if (result === "granted") {
      const text = `HEY! Your task is now overdue.`;
      const notification = new Notification("To-do List", { body: text });
  
      // You can add event listeners to handle user interactions with the notification
      notification.onclick = function() {
        alert("Notification clicked!");
      };
    }
  });
  