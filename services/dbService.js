import * as db from "../src/postgreeSQL/model.js"
export default {
  full_read: db.fullRead,
  five_read: db.fiveRead,
  single_read: db.singleRead,
  delete: db.deleteTable
};
