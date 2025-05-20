class Paginator:
    """
    Service for paginating lists of data entries.
    """

    @staticmethod
    def paginate(data_list, page_size, page_number):
        """
        Returns paginated data and metadata based on page size and number.

        Args:
            :param data_list: list of items to paginate.
            :type data_list: list
            :param page_size: number of items per page.
            :type page_size: int
            :param page_number: page index (starting at 1).
            :type page_number: int

        Returns:
            Dictionary containing pagination info and the data chunk.
        """
        page_size = int(page_size)
        page_number = int(page_number)
        total_data = len(data_list)
        total_pages = max(1, (total_data + page_size - 1) // page_size)

        if page_number < 1 or page_number > total_pages:
            return {"pagination_info": {...}, "data": []}

        start = (page_number - 1) * page_size
        end = start + page_size

        return {
            "pagination_info": {
                'current_page': page_number,
                'total_data': total_data,
                'total_pages': total_pages,
                'page_size': page_size
            },
            "data": data_list[start:end]
        }