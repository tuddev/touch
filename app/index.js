(async function () {
  const ws = await connectToServer();
  const circle = document.querySelector("#circle");

  ws.onmessage = (webSocketMessage) => {
    const messageBody = JSON.parse(webSocketMessage.data);
    console.log("messageBody", messageBody);
    circle.className = "circle";
    if (messageBody.state.every((user) => user.state === "active")) {
      circle?.classList.add("active-both");
      return;
    }

    if (messageBody.state.some((user) => user.state === "hover")) {
      circle?.classList.add("hover-both");
      return;
    }
  };

  const messageBody = { roomId: "room1", eventType: "active" };
  ws.send(JSON.stringify(messageBody));

  circle?.addEventListener("mousedown", () => {
    const messageBody = { roomId: "room1", eventType: "click" };
    ws.send(JSON.stringify(messageBody));
  });

  document.body.addEventListener("mouseup", (event) => {
    if (event?.target.id === "circle") {
      const messageBody = { roomId: "room1", eventType: "hover" };
      ws.send(JSON.stringify(messageBody));
      return;
    }

    const messageBody = { roomId: "room1", eventType: "active" };
    ws.send(JSON.stringify(messageBody));
  });

  circle?.addEventListener("mouseover", () => {
    const messageBody = { roomId: "room1", eventType: "hover" };
    ws.send(JSON.stringify(messageBody));
  });

  circle?.addEventListener("mouseout", () => {
    const messageBody = { roomId: "room1", eventType: "active" };
    ws.send(JSON.stringify(messageBody));
  });

  async function connectToServer() {
    const ws = new WebSocket("ws://touch-uwfc.onrender.com:10000");
    console.log(ws);
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (ws.readyState === 1) {
          clearInterval(timer);
          resolve(ws);
        }
      }, 10);
    });
  }
})();
