module.exports = (limitItems, query, count) => {
  const objectPagination = {
    currentPage: 1,
    limitItems: limitItems
  };

  if(query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  if(query.limit) {
    objectPagination.limitItems = parseInt(query.limit);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  objectPagination.totalPage = Math.ceil(count/objectPagination.limitItems);

  return objectPagination;
}