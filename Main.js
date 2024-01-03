console.log("Running")
document.getElementById("Notify").addEventListener("click", () => {
  console.log("Clicked")
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
    console.log("granred")
      const text = `HEY! Your task is now overdue.`;
      const notification = new Notification("To-do List", { body: text });
      console.log(notification)
  
      notification.onclick = function() {
        alert("Notification clicked!");
      };
    }
  });

})
  