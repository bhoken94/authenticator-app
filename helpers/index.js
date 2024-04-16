import { database } from "./db-service";

try {
  await database.dropDatabaseTableAsync();
  await database.setupDatabaseAsync();
  await database.setupTokensAsync();

  setDBLoadingComplete(true);
} catch (e) {
  console.warn(e);
}
