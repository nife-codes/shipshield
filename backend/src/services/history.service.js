const { db } = require("../services/firebase");

const saveScan = async (scan) => {
  await db.collection("scans").add(scan);
};

const getUserScans = async (userId) => {
  const snapshot = await db
    .collection("scans")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

module.exports = { saveScan, getUserScans };
