const port = Deno.args[0];
const listener = Deno.listen({ port });

const handleConnection = async (conn) => {
  const writer = conn.writable.getWriter();

  for await (const chunk of conn.readable) {
    const req = new TextDecoder().decode(chunk);
    console.log(req);
    writer.write(chunk);
  }
};

for await (const conn of listener) {
  handleConnection(conn);
}
