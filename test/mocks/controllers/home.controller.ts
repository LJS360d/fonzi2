import { Request, Response } from 'express';
import { Post, Get, ServerController } from '../../../dist';
import assert from 'assert';

export default class HomeController extends ServerController {
  @Get('/home')
  public homeGet(req: Request, res: Response) {
    res.send('test');
  }

  @Post('/home')
  public homePost(req: Request<any, any, { test: string }, any>, res: Response) {
    const { body } = req;
    assert(body.test === 'test');
    res.send('test-post');
  }
}
