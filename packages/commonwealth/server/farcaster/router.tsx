import express from 'express';
import {
  checkEligibility,
  contestCard,
  viewLeaderboard,
} from './frames/contest';
import { resultGame, startGame } from './frames/gameExample';

const farcasterRouter = express.Router();

farcasterRouter.get('/game', startGame);
farcasterRouter.post('/game', startGame);
farcasterRouter.post('/result', resultGame);

farcasterRouter.get('/contests/:contestAddress', contestCard);
farcasterRouter.post('/contests/:contestAddress', contestCard);
farcasterRouter.post('/viewLeaderboard', viewLeaderboard);
farcasterRouter.post('/checkEligibility', checkEligibility);

export default farcasterRouter;
