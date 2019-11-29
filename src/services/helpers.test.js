import { lowerCaseObj, lowerCaseQueryParams } from './helpers';

test('toLower an object', () => {
  expect(lowerCaseObj({ 1: 2 })).toEqual({ 1: 2 });
  expect(lowerCaseObj({ A: 'B' })).toEqual({ a: 'B' });
  expect(lowerCaseObj({ Abc: 'B' })).toEqual({ abc: 'B' });
  expect(lowerCaseObj({ aBc: 'B' })).toEqual({ abc: 'B' });
});

test('parse query params', () => {
  const queryString =
    '?id=5cb253c454b7ba00088ddeb1&fullname=Russell&email=demo@deephire.com&chat=1';
  const queryParams = lowerCaseQueryParams(queryString);
  const { id, fullname, email, chat } = queryParams;
  expect(id).toEqual('5cb253c454b7ba00088ddeb1');
  expect(fullname).toEqual('Russell');
  expect(email).toEqual('demo@deephire.com');
  expect(chat).toEqual('1');
});
