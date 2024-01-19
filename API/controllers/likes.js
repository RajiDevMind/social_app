import connectDB from "../connect.js";

export const getLikes = (req, res) => {
  const createUserPost = "SELECT * FROM likes WHERE postId = ?";

  connectDB.query(createUserPost, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const createUserPost =
      "INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)";

    const userComments = [userInfo.id, req.body.postId];
    connectDB.query(createUserPost, userComments, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Yay! liked Successfully!");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const createUserPost = "DELETE FROM likes WHERE userId = ? AND  postId = ?";

    connectDB.query(
      createUserPost,
      [userInfo.id, req.query.postId],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Ohh! Unlike");
      }
    );
  });
};
