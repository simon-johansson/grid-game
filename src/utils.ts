export const getQueryStringParams = (query: string): any => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query).split("&").reduce((params: any, param) => {
        const [key, value] = param.split("=");
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
        return params;
      }, {})
    : {};
};
