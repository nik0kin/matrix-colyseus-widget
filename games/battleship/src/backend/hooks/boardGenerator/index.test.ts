import boardGenerator from './index';

describe('Hookt: boardGenerator', () => {
  it('should run boardGenerator without error', (done) => {
    const squares = boardGenerator();
    expect(squares).toBeDefined();
    expect(squares.length).toBe(200);
    done();
  });
});
