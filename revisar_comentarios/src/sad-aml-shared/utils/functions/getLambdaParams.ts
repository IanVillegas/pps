import isNullUndefinedOrBlank from './isNullUndefinedOrBlank';

export default function ResponseValidator(body: any) {
  let parameters = '';
  for (const index in body) {
    if (index !== 'token' && !isNullUndefinedOrBlank(body[index])) {
      if (parameters === '') {
        parameters += '?';
      } else {
        parameters += '&';
      }
      parameters += `${index}=${body[index]}`;
    }
  }
  return parameters;
}
