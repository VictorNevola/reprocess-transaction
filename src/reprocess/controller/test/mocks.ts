import { mockListClientAwaitingReprocess } from '../../service/test/mocks';

export const mockControllerFindAllSuccess = (
  status: number,
  success: boolean,
) => {
  return {
    data: success
      ? mockListClientAwaitingReprocess
      : {
          statusCode: status,
          message: 'Internal server error',
        },
    status: status,
  };
};
