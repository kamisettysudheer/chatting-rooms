const port = Deno.args[0];
const listener = Deno.listen({ port });
const clients = new Map();
const rooms = new Set();
let clientId = 0;

const isRoomsAvailable = (currentRooms) =>
  currentRooms.length === 0 || [...currentRooms.at(-1)].length === 2;

const joinInRoom = (conn) => {
  if (isRoomsAvailable([...rooms])) {
    const room = new Set();
    rooms.add(room);
  }

  return [...rooms].at(-1).add(conn);
};

const sendResponseToRoommates = (conn, clientId, response) => {
  [...rooms].forEach((room) => {
    if (room.has(conn)) {
      console.log(room);
      return sendResponseToAll(clientId, response, room);
    }
  });
};

const sendResponseToAll = (clientId, response, room) => {
  [...room].forEach(async (value) => {
    const msg = `client ${clientId} : ${response}`;
    console.log(value, `message:${msg}`);
    await value.write(new TextEncoder().encode(msg));
    console.log("Message sent!");
  });
};

const handleConnection = async (conn, clientId) => {
  joinInRoom(conn);
  clients.set(clientId, conn);

  for await (const chunk of conn.readable) {
    const req = new TextDecoder().decode(chunk);
    const response = req; //handleReq()
    console.log(response);
    sendResponseToRoommates(conn, clientId, response);
  }
};

for await (const conn of listener) {
  handleConnection(conn, clientId++);
}
