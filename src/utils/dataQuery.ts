export const dataQuery = (
  items: { [key: string]: any }[],
  limit: number,
  page: number
) => {
  return {
    items: items || [],
    totalItem: items.length || 0,
    itemPerPage: limit || 0,
    totalPage: +(items.length / limit).toFixed(0) || 0,
    currentPage: page || 0,
  };
};
