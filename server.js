const isRoomsAvailable = (currentRooms) =>
  currentRooms.length === 0 || [...currentRooms.at(-1)].length === 2;

const joinInRoom = (conn, rooms) => {
  if (isRoomsAvailable([...rooms])) {
    const room = new Set();
    rooms.add(room);
  }

  return [...rooms].at(-1).add(conn);
};

const sendResponseToAll = (clientId, response, room) => {
  [...room].forEach(async (value) => {
    const msg = `client ${clientId} : ${response}`;
    await value.write(new TextEncoder().encode(msg));
  });
};

const sendResponseToRoommates = (rooms, conn, clientId, response) => {
  [...rooms].forEach((room) => {
    if (room.has(conn)) {
      return sendResponseToAll(clientId, response, room);
    }
  });
};

const handleConnection = async (conn, clientId, clients, rooms) => {
  joinInRoom(conn, rooms);
  clients.set(clientId, conn);

  for await (const chunk of conn.readable) {
    const req = new TextDecoder().decode(chunk);
    const response = req; //handleReq()
    console.log(response);
    sendResponseToRoommates(rooms, conn, clientId, response);
  }
};

const main = async () => {
  const port = Deno.args[0];
  const listener = Deno.listen({ port });
  const clients = new Map();
  const rooms = new Set();
  let clientId = 0;

  for await (const conn of listener) {
    handleConnection(conn, clientId++, clients, rooms);
  }
};

main();
