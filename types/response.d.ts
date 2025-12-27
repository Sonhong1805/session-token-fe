interface Response<T> {
  success: boolean;
  message: string | string[];
  data: T;
}
