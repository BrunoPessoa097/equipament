export const ApiProperty = () => () => {};
export const ApiTags = () => () => {};
export const ApiOperation = () => () => {};
export const ApiBody = () => () => {};
export const ApiResponse = () => () => {};
export const ApiParam = () => () => {};
export const ApiQuery = () => () => {};
export const ApiBearerAuth = () => () => {};
export const ApiHeader = () => () => {};
export const ApiConsumes = () => () => {};
export const ApiProduces = () => () => {};

export function PartialType<T>(classRef: new () => T): new () => Partial<T> {
  return classRef;
}

export default new Proxy(
  {},
  {
    get: () => () => () => {},
  },
);
