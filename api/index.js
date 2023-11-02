const WebSocket = require("ws");

const PORT = 80;
const wss = new WebSocket.Server({ port: PORT });
const clients = new Map();

const state = {
  room1: [],
};

wss.on("connection", (ws) => {
  const id = uuidv4();
  const initialState = "active";
  const metadata = { id, state: initialState };

  clients.set(ws, metadata);
  ws.on("message", (messageAsString) => {
    const message = JSON.parse(messageAsString);
    const getUser = (id) => state.room1.find((user) => user.id === id);

    const metadata = clients.get(ws);

    message.sender = metadata.id;
    let user = getUser(metadata.id);
    if (!user) {
      const newUser = {
        id: metadata.id,
        state: initialState,
      };

      state.room1.push(newUser);

      user = getUser(metadata.id);
    }

    console.log(user);

    switch (message.eventType) {
      case "active":
        user.state = "active";

        break;
      case "hover":
        user.state = "hover";
        break;
      case "click":
        user.state = "click";
        break;
      default:
        break;
    }

    [...clients.entries()]
      .filter(([key, user]) => !!getUser(user.id))
      .map(([key, _]) => key)
      .forEach((client) => {
        client.send(JSON.stringify({ state: state.room1 }));
      });
  });

  ws.send("Hello! Message From Server!!");

});

wss.on("close", (ws) => {
  state.room1 = state.room1.filter((user) => user.id !== clients.get(ws).id);
  clients.delete(ws);
});

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

console.log("wss up");
