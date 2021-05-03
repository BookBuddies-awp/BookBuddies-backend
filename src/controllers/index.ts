import { RequestHandler } from 'express';

const homeController: RequestHandler = (req, res, next) => {
  res.send('Hello from Book Buddies 👋 !');
};

export default homeController;
