import { db } from "../connect.js";

export const getSuggestions = (req, res) => {
  const q = "SELECT * FROM users ORDER BY RAND() LIMIT 20";

  db.query(q, (err, results) => {
    if (err) {
      console.error("Error fetching suggestions:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(results);
  });
};
