import express from "express";
import { hotelsApi } from "pods/hotel";
import path from "path";
import { createRestApiServer, connectToDBServer } from "core/servers";
import { envConstants } from "core/constants";
import {
  logRequestMiddleware,
  logErrorRequestMiddleware,
} from "common/middlewares";
import { securityApi, authenticationMiddleware } from 'pods/security';
import { userApi } from 'pods/user';



const restApiServer = createRestApiServer();


restApiServer.use(logRequestMiddleware);
restApiServer.use('/api/security', securityApi);

const staticFilesPath = path.resolve(__dirname, envConstants.STATIC_FILES_PATH);
restApiServer.use("/", express.static(staticFilesPath));

restApiServer.use("/api/hotels", authenticationMiddleware, hotelsApi)
restApiServer.use('/api/users', authenticationMiddleware, userApi);

restApiServer.use(logErrorRequestMiddleware);

restApiServer.listen(envConstants.PORT, async () => {
  if (!envConstants.isApiMock) {
    await connectToDBServer(envConstants.MONGODB_URI);
    console.log("Connected to DB");
  } else {
    console.log("Running API mock");
  }
  console.log(`Server ready at port ${envConstants.PORT}`);
});
