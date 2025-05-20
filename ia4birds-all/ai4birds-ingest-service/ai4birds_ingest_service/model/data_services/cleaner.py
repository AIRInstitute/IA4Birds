class DataCleaner:
    """
    Service for cleaning invalid characters in a pandas DataFrame.
    """

    @staticmethod
    def clean_invalid_characters(df):
        """
        Replaces invalid characters in string columns to ensure UTF-8 compatibility.

        Args:
            :param df: pandas DataFrame to clean.
            :type df: pd.DataFrame

        Returns:
            Cleaned pandas DataFrame.
        """
        for col in df.columns:
            if df[col].dtype == object:
                df[col] = df[col].apply(lambda x: x.encode('utf-8', 'replace').decode('utf-8') if isinstance(x, str) else x)
        return df