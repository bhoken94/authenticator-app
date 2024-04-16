import * as SQLite from "expo-sqlite";
import { updateTotp } from "./utility";

/**
 * {
 *  type: 'totp',
 *  label: { issuer: 'ACME Co', account: 'jane@example.com' },
 *  query: {
 *   secret: 'JBSWY3DPEHPK3PXP',
 *   digits: '6'
 *  }
 * }
 */

const db = SQLite.openDatabase("authenticator-app.db");

const getTokenList = (setTokenFunction) => {
  db.transaction(
    (tx) => {
      tx.executeSql("select * from tokens", [], (_, { rows: { _array } }) => {
        updateTotp(_array, setTokenFunction);
      });
    },
    (t, error) => {
      console.log("db error load tokens");
      console.log(error);
    },
    (_t, _success) => {
      console.log("loaded tokens");
    }
  );
};

const insertToken = (secret, issuer, account, otherValues, successFunc) => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "insert into tokens (secret, issuer, account, otherValues) values (?,?,?,?)",
        [secret, issuer, account, otherValues]
      );
    },
    (t, error) => {
      console.log("db error insertToken");
      console.log(error);
    },
    (t, success) => {
      successFunc();
    }
  );
};

const deleteTokenById = (tokenId, successFunc, callbackParams) => {
  db.transaction(
    (tx) => {
      tx.executeSql("delete from tokens where id = ?", [tokenId]);
    },
    (t, error) => {
      console.log("db error deleteTokenById");
      console.log(error);
    },
    (t, success) => {
      if (callbackParams) {
        successFunc(callbackParams);
      } else {
        successFunc();
      }
    }
  );
};

const dropDatabaseTableAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "drop table if exists tokens",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          console.log("error dropping tokens table");
          reject(error);
        }
      );
    });
  });
};

const setupDatabaseAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists tokens (id integer primary key not null, secret text, issuer text, account text, otherValues text)"
        );
      },
      (_, error) => {
        console.log("db error creating table token");
        console.log(error);
        reject(error);
      },
      (_, success) => {
        resolve(success);
      }
    );
  });
};

const setupTokensAsync = async () => {
  return new Promise((resolve, _reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into tokens (id,secret, issuer, account, otherValues) values (?,?,?,?,?)",
          [
            1,
            "FFIFPM3JYYHBY7VP7ZRI4GHCSOVXBPVM",
            "Google",
            "alessandra.santomassimo",
            "",
          ]
        );
      },
      (t, error) => {
        console.log("db error insertToken");
        console.log(error);
        resolve();
      },
      (t, success) => {
        resolve(success);
      }
    );
  });
};

export const database = {
  getTokenList,
  setupDatabaseAsync,
  insertToken,
  setupTokensAsync,
  dropDatabaseTableAsync,
  deleteTokenById,
};
