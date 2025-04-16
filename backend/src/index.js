require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./db');
const cors = require('cors');

app.use(cors());
app.use(express.json());


// Routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.route');
const notificationRoutes = require('./routes/notification.route');
const recommendationRoutes = require('./routes/recommendation.routes');
const verifyJWT = require('./middlewares/auth.middleware');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', verifyJWT, postRoutes);
app.use('/api/v1/comments', verifyJWT, commentRoutes);
app.use('/api/v1/notifications', verifyJWT, notificationRoutes);
app.use('/api/v1/recommendations', verifyJWT, recommendationRoutes);

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
});