import { httpServer, PORT } from "./config/app";

// Start the server
httpServer.listen(PORT, () =>
  console.log(`Server is running 🚀🚀🚀 on http://localhost:${PORT}/graphql`)
);
