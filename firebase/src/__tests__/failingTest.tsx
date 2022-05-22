import { helloSSSSS } from "../authentication/sss";

test("expect failed", () => {
    expect(2).toEqual(2);

  });

  test("expect failed 2", () => {
    expect(helloSSSSS()).toBe('hello')
  });  